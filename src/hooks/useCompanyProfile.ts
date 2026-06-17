import { useState, useEffect } from "react";

export function useCompanyProfile() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch("/api/company-profile");
                if (!response.ok) throw new Error("Failed to fetch");
                const result = await response.json();

                if (result.success && result.data?.fileUrl) {
                    const url = result.data.fileUrl;
                    setPdfUrl(url);
                    // Proxy URL forces direct download (bypasses cross-origin restriction)
                    setDownloadUrl(
                        `/api/download-pdf?url=${encodeURIComponent(url)}&filename=Company-Profile-KJPP-AKR.pdf`
                    );
                }
            } catch (error) {
                console.error("Error loading company profile PDF:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    return { pdfUrl, downloadUrl, loading };
}
