import { locales } from "@/i18n-config";
import { z } from "zod";

type TranslationProps = {
  texts: string[];
  from: string;
  to: string[];
};

const TranslateTextSchema = z.array(
  z.object({
    translations: z.array(
      z.object({
        text: z.string(),
        to: z.string(),
      })
    ),
  })
);

export async function translateText({ from, texts, to }: TranslationProps) {
  let endpoint = "https://api-eur.cognitive.microsofttranslator.com/";
  const url = `${endpoint}translate?api-version=3.0&from=${from}&to=${to.join(
    "&to="
  )}`;

  const data = texts.map((text) => ({ text }));
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MICROSOFT_TRANSLATOR_KEY!,
        "Content-type": "application/json",
        "Ocp-Apim-Subscription-Region": "francecentral",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const translatedText = await response.json();
      return TranslateTextSchema.parse(translatedText);
    } else {
      return [{ translations: [] }];
    }
  } catch (error: any) {
    console.error(error);
  }
}

const usLocale = "en-us";
export const remainingLocales = (currentLocale: string) =>
  locales.reduce((acc: string[], curr) => {
    if (curr !== currentLocale) {
      // check if curr === en-us to transform it to en before pushing in acc since microsoft translator doesn't support en-us
      if (curr === usLocale) {
        acc.push("en");
      } else {
        acc.push(curr);
      }
    }
    return acc;
  }, []);
