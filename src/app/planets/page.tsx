import { Planet } from "@/lib/types";

export default function PlanetPage() {
  return <div>Planet Page</div>;
}

function get_planets(): Promise<Planet[]> {
  return fetch("./api/planets").then((response) => response.json());
}
