export const authorizeAdmin = (req: any, res: any, next: any) => {
    if (req.user?.isAdmin) {
        next()
    }
    else {
        return res.status(403).json({ message: "Access Denied, Admins Only" })
    }
}