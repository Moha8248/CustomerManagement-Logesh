export default function SearchBar({ search, setSearch }) {
    return (
        <div className="max-w-xl mx-auto mb-4">
            <input
                type="search"
                placeholder="Search customers by any detail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border p-2 rounded"
            />
        </div>
    );
}
  