// Use type safe message keys with `next-intl`
type Messages = typeof import("./dictionaries/fr.json");

declare type IntlMessages = Messages;
