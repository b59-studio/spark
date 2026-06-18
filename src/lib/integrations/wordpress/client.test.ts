import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchWordPressPageBySlug,
  fetchWordPressPages,
} from "@/lib/integrations/wordpress/client";

const config = { apiBaseUrl: "https://cms.example.org" };

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(json: unknown, ok = true, status = 200) {
  return vi.spyOn(global, "fetch").mockResolvedValue({
    ok,
    status,
    json: async () => json,
  } as Response);
}

describe("fetchWordPressPageBySlug", () => {
  it("requests the pages endpoint filtered by slug and returns the first match", async () => {
    const page = {
      id: 7,
      slug: "mission",
      title: { rendered: "Mission" },
      content: { rendered: "<p>Hi</p>" },
    };
    const spy = mockFetch([page]);

    const result = await fetchWordPressPageBySlug(config, "mission");

    expect(result).toEqual(page);
    const url = spy.mock.calls[0]?.[0] as string;
    expect(url).toContain("/wp-json/wp/v2/pages?");
    expect(url).toContain("slug=mission");
    expect(url).toContain("per_page=1");
  });

  it("returns null when no page matches the slug", async () => {
    mockFetch([]);
    expect(await fetchWordPressPageBySlug(config, "nope")).toBeNull();
  });

  it("throws on a non-ok response (e.g. origin 525)", async () => {
    mockFetch(null, false, 525);
    await expect(fetchWordPressPages(config)).rejects.toThrow(/525/);
  });
});
