import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "@shared/schema";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("salary field validation (Zod schema)", () => {
  const validBase = {
    companyName: "Google",
    roleTitle: "Software Engineer",
  };

  test("accepts a prospect without a salary", () => {
    const result = insertProspectSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetSalary).toBeUndefined();
    }
  });

  test("accepts an empty string salary", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: "" });
    expect(result.success).toBe(true);
  });

  test("accepts a null salary", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: null });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetSalary).toBeNull();
    }
  });

  test("accepts a formatted salary string like '$150,000'", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: "$150,000" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetSalary).toBe("$150,000");
    }
  });

  test("accepts a plain number salary string like '120000'", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: "120000" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetSalary).toBe("120000");
    }
  });

  test("accepts a salary with range like '$100k - $130k'", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: "$100k - $130k" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetSalary).toBe("$100k - $130k");
    }
  });

  test("rejects a non-string salary (number)", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, targetSalary: 150000 });
    expect(result.success).toBe(false);
  });
});
