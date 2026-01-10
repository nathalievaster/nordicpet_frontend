<script setup></script>

<template>
  <main class="container mt-4">
    <header class="mb-4">
      <h1>Välkommen till NordicPet Intranät</h1>

      <p class="lead">
        Detta är NordicPets interna system för hantering av produkter, lager och kategorier.
        Här samlas allt som behövs för att säkerställa ett smidigt arbetsflöde och hög kvalitet
        i vårt sortiment av djurprodukter.
      </p>
    </header>

    <section class="row mt-4" aria-label="Systemets huvudfunktioner">
      <article class="col-md-4 mb-3">
        <section class="card h-100 shadow-sm">
          <header class="card-body">
            <h2 class="card-title h5">Produkter</h2>
            <p class="card-text">
              Se, redigera och hantera NordicPets sortiment av djurprodukter.
              Admin kan lägga till nya produkter och uppdatera befintliga.
            </p>
          </header>
        </section>
      </article>

      <article class="col-md-4 mb-3">
        <section class="card h-100 shadow-sm">
          <header class="card-body">
            <h2 class="card-title h5">Kategorier</h2>
            <p class="card-text">
              Produkter är organiserade i tydliga kategorier för enkel översikt
              och struktur inom sortimentet.
            </p>
          </header>
        </section>
      </article>

      <article class="col-md-4 mb-3">
        <section class="card h-100 shadow-sm">
          <header class="card-body">
            <h2 class="card-title h5">Lager</h2>
            <p class="card-text">
              Håll koll på lagersaldo och säkerställ att våra produkter alltid finns
              tillgängliga när de behövs.
            </p>
          </header>
        </section>
      </article>
    </section>

    <footer class="mt-4">
      <hr>
      <p class="text-muted text-center">
        NordicPet – För djurens bästa, varje dag!
      </p>
    </footer>
  </main>
</template>

<style scoped>
  main {
    max-width: 900px;
    margin: 0 auto;
  }

  section {
    margin: 2em 0em;
  }
</style>