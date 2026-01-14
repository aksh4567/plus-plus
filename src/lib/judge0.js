// src/lib/judge0.js
import axios from "axios";

// 1. Set the new base URL
const JUDGE0_URL = "https://ce.judge0.com/submissions/batch";

export const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
    };
    return language[lang.toLowerCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitBatch = async (submissions) => {
    const options = {
        method: "POST",
        url: JUDGE0_URL,
        params: {
            base64_encoded: "false",
        },
        headers: {
            // No RapidAPI keys needed here
            "Content-Type": "application/json",
        },
        data: {
            submissions,
        },
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error("Judge0 rate limit reached (429 Too Many Requests)");
        }
        console.error("submitBatch error:", error);
        throw error;
    }
};

export const submitToken = async (resultToken) => {
    const options = {
        method: "GET",
        url: JUDGE0_URL, // Using the same batch endpoint for polling
        params: {
            tokens: resultToken.join(","),
            base64_encoded: "false",
            fields: "*",
        },
        // No headers required for public GET requests
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            if (error.response?.status === 429) {
                throw new Error("Judge0 rate limit reached (429 Too Many Requests)");
            }
            console.error("submitToken fetch error:", error);
            throw error;
        }
    }

    while (true) {
        const result = await fetchData();
        const isResultObtained = result.submissions.every(
            (r) => r.status_id > 2
        );

        if (isResultObtained) {
            return result.submissions;
        }

        await sleep(1000);
    }
};

