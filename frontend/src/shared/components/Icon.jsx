export function Icon({ name, size = 20, color = "currentColor" }) {
    const icons = {
        briefcase: "https://img.icons8.com/ios-filled/50/briefcase.png",
        user: "https://img.icons8.com/ios-filled/50/user.png",
        company: "https://img.icons8.com/ios-filled/50/company.png",
        shield: "https://img.icons8.com/ios-filled/50/shield.png",
        list: "https://img.icons8.com/ios-filled/50/list.png",
        search: "https://img.icons8.com/ios-filled/50/search.png",
        check: "https://img.icons8.com/ios-filled/50/checkmark.png",
        close: "https://img.icons8.com/ios-filled/50/close.png",
        star: "https://img.icons8.com/ios-filled/50/star.png",
        cv: "https://img.icons8.com/ios-filled/50/resume.png",
    };
    return (
        <img
            src={icons[name]}
            alt={name}
            style={{ width: size, height: size, verticalAlign: "middle", marginRight: 4 }}
        />
    );
}
