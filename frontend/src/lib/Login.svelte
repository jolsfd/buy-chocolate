<script>
  import { currentAdmin, pb } from "./pocketbase";
  import Purchase from "./Purchase.svelte";

  let email;
  let password;
  let loading;

  let err;

  async function login() {
    loading = true;
    await pb.admins.authWithPassword(email, password).catch((error) => {
      err = "Login gescheitert!";
      loading = false;
    });

    // clear values for security reasons
    email = "";
    password = "";

    console.log("Welcome", $currentAdmin.email, "🩵");
  }

  async function logout() {
    loading = false;
    err = null;
    pb.authStore.clear();
    console.log("Logout 😥");
  }
</script>

<main>
  <div class="d-flex align-items-center justify-content-center">
    {#if $currentAdmin}
      <div class="col-md-7 col-lg-8">
        <div class="py-5 text-center">
          <h3>Welcome back {$currentAdmin.email}!</h3>

          <p class="lead">
            Diesen Admin Account nur mit großer Konzentration nutzen.
          </p>

          <button
            type="button"
            class="w-40 mb-2 btn btn-lg rounded-3 btn-dark"
            on:click={logout}
            >Logout <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg></button
          >
        </div>

        <Purchase />
      </div>
    {:else}
      <div class="col-md-6 col-lg-7">
        {#if err}
          <div class="alert alert-danger" role="alert">
            {err}
          </div>
        {/if}
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0">
            <h1 class="fw-bold mb-0 fs-2">Admin sign in</h1>
          </div>

          <div class="modal-body p-5 pt-0">
            <form action="/login" on:submit|preventDefault>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control rounded-3"
                  placeholder="test@example.com"
                  bind:value={email}
                />
                <label for="floatingInput">Email address</label>
              </div>

              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control rounded-3"
                  placeholder="test"
                  bind:value={password}
                />
                <label for="floatingPassword">Password</label>
              </div>

              {#if loading}
                <button
                  type="button"
                  class="w-100 mb-2 btn btn-lg rounded-3 btn-light"
                  disabled
                  ><div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div></button
                >
              {:else}
                <button
                  type="button"
                  class="w-100 mb-2 btn btn-lg rounded-3 btn-dark"
                  on:click={login}
                  >Login <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                    />
                  </svg></button
                >
              {/if}
            </form>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>
