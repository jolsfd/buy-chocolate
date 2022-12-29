<script>
  import { pb, cfStore } from "./pocketbase";
  import { Turnstile } from "svelte-turnstile";
  import Select from "./Select.svelte";
  import { prices } from "./prices";

  let bought = false;
  let details;
  let err;

  let sender = "";
  let receiver = "";
  let schoolclass = "";
  let message = "";

  function validate() {
    console.log("Validation ✅");
    if (receiver == "") {
      err = "Empfänger ist erforderlich!";
      return false;
    } else if (schoolclass == "") {
      err = "Klasse ist erforderlich!";
      return false;
    }
    return true;
  }

  async function createOrder() {
    if (!validate()) {
      return;
    }

    const data = {
      absender: sender,
      empfaenger: receiver,
      message: message,
      klasse: schoolclass,
      nummer: -1,
      paid: false,
    };

    const record = await pb
      .collection("chocolate")
      .create(data)

    details = record;

    if (record.nummer){
      bought = true;
      console.log("Created order 🍫", record);
    } else {
      human()
      console.log("No verification from backend 🤖")
    }
  }

  async function human() {
    err = "Bist du ein Mensch?";
    console.log("Not a human 🤖");
  }

  async function again() {
    bought = false;

    details = null;

    sender = "";
    receiver = "";
    schoolclass = "";
    message = "";

    err = null;
  }

  async function updateToken(token) {
    cfStore.update(token);
    console.log("New turnstile token 💾");
  }
</script>

<main>
  <div class="py-5 text-center">
    <p class="lead">
      Below is an example form built entirely with Bootstrap's form controls.
      Each required form group has a validation state that can be triggered by
      attempting to submit the form without completing it.
    </p>
  </div>
  <div class="row g-5">
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Preisliste</span>
        <span class="badge bg-primary rounded-pill" />
      </h4>
      <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">Weihnachtsmann</h6>
            <small class="text-muted">ohne Nachricht</small>
          </div>
          <span class="text-success">{prices[0]}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">Weichnachtsmann</h6>
            <small class="text-muted">mit Nachricht</small>
          </div>
          <span class="text-success">{prices[1]}</span>
        </li>
      </ul>
    </div>
    {#if bought}
      <div class="col-md-7 col-lg-8">
        <div class="card" style="mb-3">
          <div class="card-header">
            <span class="fw-bold">Nummer: {details.nummer}</span>
            <span class="text-muted">({details.id})</span>
          </div>
          <ul class="list-group list-group-flush">
            {#if details.absender}
              <li class="list-group-item">
                <span class="text-muted">Absender:</span>
                {details.absender}
              </li>
            {/if}
            <li class="list-group-item">
              <span class="text-muted">Empfänger:</span>
              {details.empfaenger}
            </li>
            <li class="list-group-item">
              <span class="text-muted">Klasse:</span>
              {details.klasse}
            </li>
            {#if details.message}
              <li class="list-group-item">
                <span class="text-muted">Nachricht:</span>
                {details.message}
              </li>
            {/if}
            {#if details.message}
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
        {#if err}
          <div class="alert alert-danger" role="alert">
            {err}
          </div>
        {/if}

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
                bind:value={sender}
                required
              />
            </div>

            <div class="col-sm-6">
              <label for="empfaenger" class="form-label">Empfänger</label>
              <input
                type="text"
                class="form-control"
                placeholder="Empfänger"
                bind:value={receiver}
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
                bind:value={message}
              />
            </div>

            <div class="col-md-5">
              <label for="klasse" class="form-label">Klasse</label>
              <select class="form-select" bind:value={schoolclass} required>
                <Select />
              </select>
            </div>
          </div>

          <hr class="my-4" />

          <Turnstile
            siteKey={import.meta.env.VITE_SITE_KEY}
            action="order"
            on:turnstile-callback={updateToken}
            on:turnstile-error={human}
            on:turnstile-timeout={human}
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
