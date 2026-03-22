"use client";

import { useState } from "react";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PatientInformationProps {
  formData: {
    fullName: string;
    age: string;
    gender: string;
    testTime: string;
    patientId?: string;
    isNewPatient?: boolean;
  };
  onFormChange: (field: string, value: string | boolean) => void;
}

export default function PatientInformation({
  formData,
  onFormChange,
}: PatientInformationProps) {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [searchError, setSearchError] = useState("");

  const isNewPatient = mode === "new";

  const handleModeChange = (newMode: "new" | "existing") => {
    setMode(newMode);
    setSearchError("");
    onFormChange("isNewPatient", newMode === "new");
  };

  const handleSearchPatient = (patientId: string) => {
    if (!patientId.trim()) {
      setSearchError("Please enter a patient ID");
      return;
    }
    // Simulated patient lookup
    console.log("[v0] Searching for patient:", patientId);
    setSearchError("");
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Information</h2>
        <p className="text-muted-foreground">Patient details</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={isNewPatient ? "default" : "outline"}
          onClick={() => handleModeChange("new")}
          className="flex-1"
        >
          <User className="w-4 h-4 mr-2" />
          Register New Patient
        </Button>
        <Button
          variant={!isNewPatient ? "default" : "outline"}
          onClick={() => handleModeChange("existing")}
          className="flex-1"
        >
          <Search className="w-4 h-4 mr-2" />
          Find Existing Patient
        </Button>
      </div>

      {/* New Patient Form */}
      {isNewPatient && (
        <Card className="bg-secondary/50 border-0 p-6 mb-8 flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Register New Patient
            </h3>
            <p className="text-sm text-muted-foreground">
              Please provide basic details for the analysis
            </p>
          </div>
        </Card>
      )}

      {/* Existing Patient Form */}
      {!isNewPatient && (
        <Card className="bg-secondary/50 border-0 p-6 mb-8 flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Find Patient</h3>
            <p className="text-sm text-muted-foreground">
              Search for an existing patient using their ID
            </p>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {isNewPatient ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => onFormChange("fullName", e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Patient ID <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g., PAT-2024-001"
                value={formData.patientId || ""}
                onChange={(e) => onFormChange("patientId", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Gender <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => onFormChange("gender", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Age <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="45"
                  value={formData.age}
                  onChange={(e) => onFormChange("age", e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Patient ID <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter patient ID"
                value={formData.patientId || ""}
                onChange={(e) => onFormChange("patientId", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => handleSearchPatient(formData.patientId || "")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Search
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-destructive mt-2">{searchError}</p>
            )}
            {formData.patientId && !searchError && (
              <Card className="bg-secondary/50 border-0 p-4 mt-4">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Patient Found
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Name: John Doe (Demo)</p>
                  <p>Age: 62</p>
                  <p>Gender: Male</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
