package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/hook"
)

const secret = "INSERT_YOUR_KEY"

type turnstileResponse struct {
	Success     bool   `json:"success"`
	ChallengeTs string `json:"challenge_ts"`
	Hostname    string `json:"hostname"`
	CData       string `json:"cdata"`
}

type tokenResponse struct {
	Token string `json:"cf-turnstile-response"`
}

func validateToken(e *core.RecordCreateEvent) error {
	req := e.HttpContext.Request()

	var res tokenResponse
	err := json.NewDecoder(req.Body).Decode(&res)
	if err != nil {
		return hook.StopPropagation
	}

	// docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
	// log.Println(res.Token)

	// create request
	formData := url.Values{}
	formData.Add("secret", secret)
	formData.Add("response", res.Token)

	// verify at cloudflare
	resCf, err := http.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", formData)
	if err != nil {
		return hook.StopPropagation
	}

	// decode response
	var outcome turnstileResponse

	err = json.NewDecoder(resCf.Body).Decode(&outcome)
	if err != nil {
		return hook.StopPropagation
	}

	//log.Println(resCf)
	//log.Println(outcome)

	// check if challenge was solved
	if outcome.Success {
		return nil
	} else {
		return hook.StopPropagation
	}
}

func getLastNumber(dao *daos.Dao) ([]*models.Record, error) {
	collection, err := dao.FindCollectionByNameOrId("chocolate")
	if err != nil {
		return nil, err
	}

	query := dao.RecordQuery(collection).OrderBy("nummer DESC").Limit(1)

	rows := []dbx.NullStringMap{}
	if err := query.All(&rows); err != nil {
		log.Fatal(err)
		return nil, err
	}

	return models.NewRecordsFromNullStringMaps(collection, rows), nil
}

func main() {
	app := pocketbase.New()

	// set every buyer record to not paided
	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		// check for the correct database record
		if e.Record.Collection().Name != "chocolate" {
			return nil
		}

		// check if bot
		err := validateToken(e)
		if err != nil {
			log.Println(err)
			return hook.StopPropagation
		}

		records, err := getLastNumber(app.Dao())
		if err != nil {
			return hook.StopPropagation
		}

		last := 0
		if len(records) == 0 {
			last = 1
		} else {
			last = records[0].GetInt("nummer")
		}
		// increment value
		new := last + 1
		// log.Println(last, new)

		e.Record.Set("nummer", new)

		// set paid status to false
		e.Record.Set("paid", false)

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
