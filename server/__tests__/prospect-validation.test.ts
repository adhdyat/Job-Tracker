import { validateProspect } from "../prospect-helpers";
import { insertProspectSchema } from "@shared/schema";

const validBase = {
  companyName: "Google",
  roleTitle: "Software Engineer",
};

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

describe("application deadline validation (Zod schema)", () => {
  test("accepts a prospect without a deadline", () => {
    const result = insertProspectSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.applicationDeadline).toBeUndefined();
    }
  });

  test("accepts a null deadline", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, applicationDeadline: null });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.applicationDeadline).toBeNull();
    }
  });

  test("accepts an empty string deadline", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, applicationDeadline: "" });
    expect(result.success).toBe(true);
  });

  test("accepts a valid date string deadline", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, applicationDeadline: "2026-03-15" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.applicationDeadline).toBe("2026-03-15");
    }
  });

  test("rejects a non-string deadline (number)", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, applicationDeadline: 20260315 });
    expect(result.success).toBe(false);
  });
});

describe("applied date validation (Zod schema)", () => {
  test("defaults appliedDate to undefined when not provided", () => {
    const result = insertProspectSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appliedDate).toBeUndefined();
    }
  });

  test("accepts a null appliedDate", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, appliedDate: null });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appliedDate).toBeNull();
    }
  });

  test("accepts a valid ISO date string for appliedDate", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, appliedDate: "2026-03-10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appliedDate).toBe("2026-03-10");
    }
  });

  test("rejects a non-string appliedDate (number)", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, appliedDate: 12345 });
    expect(result.success).toBe(false);
  });

  test("appliedDate is preserved when status is Applied", () => {
    const result = insertProspectSchema.safeParse({
      ...validBase,
      status: "Applied",
      appliedDate: "2026-03-01",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appliedDate).toBe("2026-03-01");
      expect(result.data.status).toBe("Applied");
    }
  });
});

describe("thankYouSent validation (Zod schema)", () => {
  test("defaults thankYouSent to false when not provided", () => {
    const result = insertProspectSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.thankYouSent).toBe(false);
    }
  });

  test("accepts thankYouSent as true", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, thankYouSent: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.thankYouSent).toBe(true);
    }
  });

  test("accepts thankYouSent as false", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, thankYouSent: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.thankYouSent).toBe(false);
    }
  });

  test("rejects a non-boolean thankYouSent (string)", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, thankYouSent: "yes" });
    expect(result.success).toBe(false);
  });

  test("rejects a non-boolean thankYouSent (number)", () => {
    const result = insertProspectSchema.safeParse({ ...validBase, thankYouSent: 1 });
    expect(result.success).toBe(false);
  });
});
