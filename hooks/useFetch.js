import { useState } from "react";
import { toast } from "sonner";

export function useFetch(callback) {
  const [data, setData] = useState(undefined);
  const [isLoading, setisLoading] = useState(null);
  const [error, setError] = useState(null);

  async function execute(...args) {
    setisLoading(true);
    setError(null);

    try {
      const response = await callback(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setisLoading(false);
    }
  }
  return { data, isLoading, error, execute, setData };
}
