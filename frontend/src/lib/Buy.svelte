<script>
  import { fly } from "svelte/transition";
  import { pb, cfStore } from "./pocketbase";
  import { Turnstile } from "svelte-turnstile";
  import Select from "./Select.svelte";
  import { prices } from "./prices";
  import Error from "./Error.svelte";

  let bought = false;
  let responseRecord;
  let err;

  let draft = {
    absender: "",
    empfaenger: "",
    klasse: "",
    nachricht: "",
    nummer: -1,
    bezahlt: false,
  };

  function validate() {
    console.log("Validation ✅");
    if (draft.empfaenger == "") {
      err = "Empfänger ist erforderlich!";
      return false;
    } else if (draft.klasse == "") {
      err = "Klasse ist erforderlich!";
      return false;
    }
    return true;
  }

  async function createOrder() {
    if (!validate()) {
      return;
    }

    const record = await pb.collection("chocolate").create(draft);

    responseRecord = record;

    if (record.nummer) {
      bought = true;
      console.log("Created order 🍫", record);
    } else {
      human();
      console.log("No verification from backend 🤖");
    }
  }

  async function human() {
    err = "Bist du ein Mensch? Seite neu laden!";
    console.log("Not a human 🤖");
  }

  async function again() {
    bought = false;

    responseRecord = null;

    draft = {
      absender: "",
      empfaenger: "",
      klasse: "",
      nachricht: "",
      nummer: -1,
      bezahlt: false,
    };

    err = null;
  }

  function updateToken(e) {
    const token = e.detail.token;
    cfStore.update((old) => token);
    console.log("New turnstile token 💾");
  }
</script>

<main>
  <div class="py-5 left col-md-7 lead">
    <h2 class="py-2">Anleitung</h2>
      <ol class="list-group list-group-numbered list-group-flush">
        <li class="list-group-item">Daten für Bestellung in unten stehendes Formular eingeben. Wenn du den Osterhasen anonym bestellen möchtest, dann lasse das Absender Feld frei.🔤</li>
        <li class="list-group-item">Bestellung mit dem Bestellen Knopf bestätigen. ✅ <b>Die Nummer im nachfolgenden Fenster musst du dir merken❗</b></li>
        <li class="list-group-item">Die Bezahlung erfolgt entweder vor Ort im Schulhaus oder bei deinem Klassensprecher.💵 🧡 <b>Dafür ist die Nummer zwingend notwendig❗</b></li>
        <li class="list-group-item">Weiter bestellen🎉</li>
      </ol>
  </div>
  <div class="row g-5">
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-left mb-3">
        <span class="text-primary">Preisliste</span>
        <span class="badge bg-primary rounded-pill" />
      </h4>
      <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">Osterhase</h6>
            <small class="text-muted">ohne Nachricht</small>
          </div>
          <span class="text-success">{prices[0]}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">Osterhase</h6>
            <small class="text-muted">mit Nachricht</small>
          </div>
          <span class="text-success">{prices[1]}</span>
        </li>
      </ul>
    </div>
    {#if bought}
      <div class="col-md-7 col-lg-8" in:fly={{ y: -100, duration: 1000 }}>
        <div class="card" style="mb-3">
          <div class="card-header">
            <span class="fw-bold">Nummer: {responseRecord.nummer}</span>
            <span class="text-muted">({responseRecord.id})</span>
          </div>
          <ul class="list-group list-group-flush">
            {#if responseRecord.absender}
              <li class="list-group-item">
                <span class="text-muted">Absender:</span>
                {responseRecord.absender}
              </li>
            {/if}
            <li class="list-group-item">
              <span class="text-muted">Empfänger:</span>
              {responseRecord.empfaenger}
            </li>
            <li class="list-group-item">
              <span class="text-muted">Klasse:</span>
              {responseRecord.klasse}
            </li>
            {#if responseRecord.nachricht}
              <li class="list-group-item">
                <span class="text-muted">Nachricht:</span>
                {responseRecord.nachricht}
              </li>
            {/if}
            {#if responseRecord.nachricht}
              <li class="list-group-item">
                <span class="text-muted">Preis:</span>
                {prices[1]}
              </li>
            {:else}
              <li class="list-group-item">
                <span class="text-muted">Preis:</span>
                {prices[0]}
              </li>
            {/if}
          </ul>
        </div>

        <hr class="my-4" />

        <button class="w-100 btn btn-primary btn" type="submit" on:click={again}
          >Nochmal <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
            />
          </svg></button
        >
      </div>
    {:else}
      <div class="col-md-7 col-lg-8">
        <Error error={err} />

        <h4 class="mb-3"><span class="text-primary">Bestellung</span></h4>
        <form class="needs-validation" novalidate on:submit|preventDefault>
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="absender" class="form-label"
                >Absender <span class="text-muted">(Optional)</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Anonym"
                bind:value={draft.absender}
                required
              />
            </div>

            <div class="col-sm-6">
              <label for="empfaenger" class="form-label">Empfänger</label>
              <input
                type="text"
                class="form-control"
                placeholder="Empfänger"
                bind:value={draft.empfaenger}
                required
              />
            </div>

            <div class="col-12">
              <label for="nachricht" class="form-label"
                >Persönliche Nachricht <span class="text-muted">(Optional)</span
                ></label
              >
              <textarea
                class="form-control"
                rows="3"
                placeholder="Hallo, ..."
                bind:value={draft.nachricht}
              />
            </div>

            <div class="col-md-5">
              <label for="klasse" class="form-label">Klasse</label>
              <select class="form-select" bind:value={draft.klasse} required>
                <Select />
              </select>
            </div>
          </div>

          <hr class="my-4" />

          <Turnstile
            siteKey="1x00000000000000000000AA"
            action="order"
            on:turnstile-callback={updateToken}
            on:turnstile-error={human}
            on:turnstile-expired={human}
          />

          <button
            class="w-100 btn btn-success btn-lg"
            type="submit"
            on:click={createOrder}
            >Bestellen
          </button>
        </form>
      </div>
    {/if}
  </div>
</main>

<style>
  .left {
    text-align: left;
  }
</style>