<script>
  import { pb } from "./pocketbase";
  import Select from "./Select.svelte";
  import {prices } from "./prices.js";
  import Error from "./Error.svelte";

  let success;

  let num;
  //let recordId;
  let currentRecord;

  let err;

  async function viewOrder() {
    err = "";

    // const record = await pb.collection("chocolate").getOne(recordId).catch((error) => {
    //     err = "Inkorrekte ID!";
    //   });
    const record = await pb.collection("chocolate").getFirstListItem(`nummer=${num}`).catch((error) => {
      err = "Inkorrekte Nummer!";
    })
    currentRecord = record;
    console.log("View",num,"💻");
  }

  async function purchase() { 
    const data = {
      absender: currentRecord.absender,
      empfaenger: currentRecord.empfaenger,
      nachricht: currentRecord.nachricht,
      klasse: currentRecord.klasse,
      bezahlt: true,
    };

    const record = await pb.collection("chocolate").update(currentRecord.id, data).catch((error) => {
      err = "Fehler in Datenbank!";
    });

    success = true;
    console.log("Bezahlung 💳")
  }

  async function nextOrder() {
    success = false;
    num = null
    currentRecord = null;
    err = null;

    //recordId = null;
  }
</script>

<main>
  <div class="d-flex align-items-center justify-content-center">
    <div class="col-md-7 col-lg-8">
      <Error error={err} />

      {#if currentRecord && !success}
        <h4 class="mb-3"><span class="text-primary">Bestellung</span></h4>

        <form action="/purchase" on:submit|preventDefault>
          <div class="card" style="mb-3">
            <div class="card-header">
              ID: {currentRecord.id}
            </div>

            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <span class="text-muted">Absender (Optional):</span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Anonym"
                  bind:value={currentRecord.absender}
                  required
                />
              </li>
              <li class="list-group-item">
                <span class="text-muted">Empfänger:</span>
                <input
                  type="text"
                  class="form-control"
                  id="lastName"
                  placeholder="Empfänger"
                  bind:value={currentRecord.empfaenger}
                  required
                />
              </li>

              <li class="list-group-item">
                <span class="text-muted">Persönliche Nachricht (Optional):</span
                >
                <textarea
                  class="form-control"
                  rows="3"
                  placeholder="Hallo, ..."
                  bind:value={currentRecord.nachricht}
                />
              </li>

              <li class="list-group-item">
                <span class="text-muted">Klasse:</span>
                <select
                  class="form-select"
                  id="country"
                  bind:value={currentRecord.klasse}
                  required
                >
                  <Select />
                </select>
              </li>

              <li class="list-group-item">
                <span class="text-muted">Preis:</span>
                {#if currentRecord.bezahlt}
                  <span class="text-danger">Bereits bezahlt!</span>
                {:else}
                  <span class="text-success">
                    {#if currentRecord.nachricht}
                      {prices[1]}
                    {:else if !currentRecord.nachricht}
                      {prices[0]}
                    {/if}
                  </span>
                {/if}
              </li>
            </ul>
          </div>

          <hr class="my-4" />

          <button
            class="btn btn-secondary btn-lg"
            type="button"
            on:click={nextOrder}>Zurück</button
          >

          <button
            class="btn btn-success btn-lg"
            type="submit"
            on:click={purchase}>Purchase</button
          >
        </form>
      {:else if success}
        <p class="lead">Bestellung <span class="fw-bold">{currentRecord.id}</span> war erfolgreich!</p>

        <button
          class="w-100 btn btn-primary btn"
          type="submit"
          on:click={nextOrder}
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
      {:else}
        <form action="/getorder" on:submit|preventDefault>
          <div>
            <label for="num" class="form-label">Nummer:</label>
            <input
              type="text"
              class="form-control"
              placeholder="Nummer"
              bind:value={num}
            />
          </div>

          <!-- <div>
            <label for="id" class="form-label">ID:</label>
            <input
              type="text"
              class="form-control"
              placeholder="ID"
              bind:value={recordId}
            />
          </div> -->

          <button
            type="button"
            class="mt-2 w-100 btn btn-secondary"
            on:click={viewOrder}>View order</button
          >
        </form>
      {/if}
    </div>
  </div>
</main>
