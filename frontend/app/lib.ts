import { SessionOptions } from "iron-session";

export interface SessionData {
    token?: string;
    access?: string;
    user?: {
        id?: string;
        name?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        email?: string;
        role?: string;
        imageUrl?: string;
    };
    isLoggedIn?: boolean;
}

export const defautlSessionData: SessionData = {
    isLoggedIn: false,
};


export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "lama-session",
    cookieOptions: {
        httpOnly: true,
        // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
        secure: process.env.NODE_ENV === "production",
    },
};


export const formatDate = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  export function capitalizeFirstLetter(str?: string) {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1)
  }