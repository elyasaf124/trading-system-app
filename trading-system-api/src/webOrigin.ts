export let webOrigin: Array<string> = [];
if (process.env.NODE_ENV === "development") {
  console.log("dev");
  webOrigin = [
    process.env.WEB_APP_URL_DEV as string,
    process.env.WEB_APP_URL_DEV_TWO as string,
  ];
} else if (process.env.NODE_ENV === "production") {
  console.log("prod!!");
  webOrigin = [
    process.env.WEB_APP_URL_PROD as string,
    process.env.WEB_APP_URL_PROD_STRIPE as string,
  ];
}
