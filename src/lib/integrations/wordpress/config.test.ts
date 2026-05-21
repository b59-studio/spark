import { afterEach, describe, expect, it } from "vitest";
import { getWordPressConfig } from "@/lib/integrations/wordpress/config";

describe("getWordPressConfig", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it("returns null without WORDPRESS_API_URL", () => {
    delete process.env.WORDPRESS_API_URL;
    expect(getWordPressConfig()).toBeNull();
  });

  it("strips trailing slash from API URL", () => {
    process.env.WORDPRESS_API_URL = "https://cms.example.org/";
    expect(getWordPressConfig()?.apiBaseUrl).toBe("https://cms.example.org");
  });
});
