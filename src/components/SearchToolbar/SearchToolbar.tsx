import "./SearchToolbar.css";

type SearchToolbarProps = {
    children: React.ReactNode;
};

export default function SearchToolbar({
    children,
}: SearchToolbarProps) {
    return (
        <section className="search-toolbar">
            {children}
        </section>
    );
}