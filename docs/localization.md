# Interface languages

The initial Brazilian Portuguese translation covers the Mac menu bar menus,
all Settings tabs, the main panel (including light and climate controls), the
island and the bundled demo names. The floor-plan editor, connection setup,
pairing dialogs, AI Access console, widgets and backend error messages still
use English. This is a first stage, based on release v1.1.0.

The Mac shell uses `Locale.preferredLanguages`, including app-specific
`AppleLanguages`, and passes the resolved locale to the web UI. A standalone
browser uses `navigator.language`. Portuguese variants use `pt-BR`; other
languages and untranslated messages fall back to English. Restart the app
after changing its language.

Both interfaces use `locales/pt-BR.json`. Keys are complete English messages;
named placeholders such as `{name}` keep values separate from translations.
Pass display strings through `L10n.text` in Swift or `t` in JavaScript. Leave
route IDs, device commands, plan IDs and user-provided names unchanged.
Only bundled demos have their plan labels translated, on a copy of the plan.

Run the localization checks with:

```sh
node --test web/src/i18n.test.js
npm run build --prefix web
SKIP_WIDGETS=1 ./scripts/build-app.sh
```

The last command builds the Mac app without widgets when full Xcode is not
installed. The normal build also builds the widgets, which remain in English.
