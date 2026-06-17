import { useState, useEffect } from "react";

const DEFAULT_PDF_URL = "/documents/company-profile.pdf";

export function useCompanyProfile() {
    const [pdfUrl, setPdfUrl] = useState<string>(DEFAULT_PDF_URL);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("/api/company-profile");
                if (!response.ok) throw new Error("Failed to fetch");
                const result = await response.json();
                
                if (result.success && result.data?.fileUrl) {
                    setPdfUrl(result.data.fileUrl);
                }
            } catch (error) {
                console.error("Error loading company profile PDF:", error);
                setPdfUrl(DEFAULT_PDF_URL); // fallback
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    return { pdfUrl, loading };
}
