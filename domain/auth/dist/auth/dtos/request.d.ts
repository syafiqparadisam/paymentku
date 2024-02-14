export declare class registerRequest {
    user: string;
    password: string;
    email: string;
}
export declare class loginRequest {
    user: string;
    password: string;
}
export declare class loginWithGoogle {
    provider: string;
    providerID: number;
    username: string;
    email: string;
    name: {
        givenName: string;
        familyName: string;
    };
    picture: string;
}
