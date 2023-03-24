<script>
  import Buy from './lib/Buy.svelte'
  import Login from './lib/Login.svelte';
  import {Router, Route} from "svelte-navigator";
  import Help from './lib/Help.svelte';
  import Legal from './lib/Legal.svelte';

  console.log("Frontend started ☁️")
</script>

<main class="text-center">
  <div>
    <img class="logo d-block mx-auto mb-4" src="/logo.svg" alt="Logo" width="72" height="57">
  </div>
  <h1>Osterhasen 2023 🍫</h1>

  <Router>
    <div>
      <Route path="/">
        <Buy />
      </Route>
      <Route path="admin">
        <Login />
      </Route>
      <Route path="help">
        <Help />
      </Route>
      <Route path="legal">
        <div class="py-5">
          <Legal />
        </div>
      </Route>
    </div>
  </Router>

  <footer class="my-5 pt-5 text-muted text-center text-small">
    <p class="mb-1">&copy; Jolsfd 2023</p>
    <ul class="list-inline">
      <li class="list-inline-item"><a href="/legal">Datenschutz</a></li>
      <!-- <li class="list-inline-item"><a href="/legal">Hilfe</a></li> -->
    </ul>
  </footer>
</main>

<style>
  .logo {
    /* height: 6em;
    padding: 1.5em; */
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
</style>
