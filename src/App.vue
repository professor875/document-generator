<!--
  App.vue -- Root component

  Acts as a thin shell around the router. The <router-view /> component
  renders whichever view matches the current URL (LoginView or
  DashboardView). No extra layout or styling is added here so each
  view controls its own presentation.
-->

<template>
  <!-- Renders the component that matches the current route -->
  <router-view />
</template>
