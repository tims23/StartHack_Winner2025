export default function Category1() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          Search your land
        </h3>
        <p>
          Enter your farm&apos;s location to quickly find it on the map. Provide
          coordinates or the name, and get tailored agricultural insights and
          resources for your area.
        </p>
      </div>
      <div className="w-full max-w-md mt-12">
        <fieldset className="fieldset">
          <input type="text" className="input w-full" placeholder="Type here" />
          <p className="fieldset-label">Location</p>
        </fieldset>
      </div>
      <button className="btn btn-dash btn-success">Search</button>
    </div>
  );
}
