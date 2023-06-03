import axios from "axios";
import { useEffect, useState } from "react";

function useFetchProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url =
    "https://api.github.com/users/MianFaizanAmir0053/repos?sort=created";
  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(e);
        setLoading(false);
      });
  }, []);

  return [projects, loading, error];
}

export default useFetchProjects;
