import { describe, it, expect } from "vitest";
import {
  getCharacterData,
  hiraganaData,
  katakanaData,
  alphabetData,
  Character,
} from "../../utils/characterData";

describe("characterData", () => {
  describe("hiraganaData", () => {
    it("should contain 46 hiragana characters", () => {
      expect(hiraganaData).toHaveLength(46);
    });

    it("should have correct character structure", () => {
      const character = hiraganaData[0];
      expect(character).toHaveProperty("char");
      expect(character).toHaveProperty("reading");
      expect(character).toHaveProperty("category");
      expect(character.category).toBe("hiragana");
    });

    it("should have image URLs and descriptions", () => {
      hiraganaData.forEach((character) => {
        expect(character).toHaveProperty("imageUrl");
        expect(character).toHaveProperty("description");
        expect(typeof character.imageUrl).toBe("string");
        expect(typeof character.description).toBe("string");
      });
    });

    it("should contain specific characters", () => {
      const chars = hiraganaData.map((c) => c.char);
      expect(chars).toContain("あ");
      expect(chars).toContain("か");
      expect(chars).toContain("さ");
      expect(chars).toContain("ん");
    });
  });

  describe("katakanaData", () => {
    it("should contain 46 katakana characters", () => {
      expect(katakanaData).toHaveLength(46);
    });

    it("should have correct character structure", () => {
      const character = katakanaData[0];
      expect(character).toHaveProperty("char");
      expect(character).toHaveProperty("reading");
      expect(character).toHaveProperty("category");
      expect(character.category).toBe("katakana");
    });

    it("should contain specific characters", () => {
      const chars = katakanaData.map((c) => c.char);
      expect(chars).toContain("ア");
      expect(chars).toContain("カ");
      expect(chars).toContain("サ");
      expect(chars).toContain("ン");
    });
  });

  describe("alphabetData", () => {
    it("should contain 52 alphabet characters (A-Z, a-z)", () => {
      expect(alphabetData).toHaveLength(52);
    });

    it("should have correct character structure", () => {
      const character = alphabetData[0];
      expect(character).toHaveProperty("char");
      expect(character).toHaveProperty("reading");
      expect(character).toHaveProperty("category");
      expect(character.category).toBe("alphabet");
    });

    it("should contain uppercase and lowercase letters", () => {
      const chars = alphabetData.map((c) => c.char);
      expect(chars).toContain("A");
      expect(chars).toContain("Z");
      expect(chars).toContain("a");
      expect(chars).toContain("z");
    });
  });

  describe("getCharacterData", () => {
    it("should return hiragana data when category is hiragana", () => {
      const result = getCharacterData("hiragana");
      expect(result).toEqual(hiraganaData);
      expect(result).toHaveLength(46);
    });

    it("should return katakana data when category is katakana", () => {
      const result = getCharacterData("katakana");
      expect(result).toEqual(katakanaData);
      expect(result).toHaveLength(46);
    });

    it("should return alphabet data when category is alphabet", () => {
      const result = getCharacterData("alphabet");
      expect(result).toEqual(alphabetData);
      expect(result).toHaveLength(52);
    });

    it("should return empty array for invalid category", () => {
      const result = getCharacterData("invalid" as any);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("Character interface validation", () => {
    it("should validate hiragana character structure", () => {
      hiraganaData.forEach((character: Character) => {
        expect(typeof character.char).toBe("string");
        expect(typeof character.reading).toBe("string");
        expect(character.category).toBe("hiragana");
        expect(character.char.length).toBeGreaterThan(0);
        expect(character.reading.length).toBeGreaterThan(0);
      });
    });

    it("should validate katakana character structure", () => {
      katakanaData.forEach((character: Character) => {
        expect(typeof character.char).toBe("string");
        expect(typeof character.reading).toBe("string");
        expect(character.category).toBe("katakana");
        expect(character.char.length).toBeGreaterThan(0);
        expect(character.reading.length).toBeGreaterThan(0);
      });
    });

    it("should validate alphabet character structure", () => {
      alphabetData.forEach((character: Character) => {
        expect(typeof character.char).toBe("string");
        expect(typeof character.reading).toBe("string");
        expect(character.category).toBe("alphabet");
        expect(character.char.length).toBeGreaterThan(0);
        expect(character.reading.length).toBeGreaterThan(0);
      });
    });
  });
});
