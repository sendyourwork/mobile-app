export interface User {
    accessToken: string,
    username: string,
    school_class: string,
    role: 'admin' | 'user'
}