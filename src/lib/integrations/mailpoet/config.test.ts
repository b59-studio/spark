import { afterEach, describe, expect, it } from "vitest";
import { getMailPoetConfig } from "@/lib/integrations/mailpoet/config";

describe("getMailPoetConfig", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it("returns null when MailPoet env is missing", () => {
    delete process.env.MAILPOET_API_BASE_URL;
    delete process.env.MAILPOET_API_KEY;
    expect(getMailPoetConfig()).toBeNull();
  });

  it("parses base URL and optional list id", () => {
    process.env.MAILPOET_API_BASE_URL = "https://cms.example.org/";
    process.env.MAILPOET_API_KEY = "test-key";
    process.env.MAILPOET_LIST_ID = "7";

    expect(getMailPoetConfig()).toEqual({
      apiBaseUrl: "https://cms.example.org",
      apiKey: "test-key",
      listId: 7,
    });
  });
});
