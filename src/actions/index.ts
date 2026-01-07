export type ActionResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
};

export * from "./auth";
export * from "./news";
export * from "./gallery";
