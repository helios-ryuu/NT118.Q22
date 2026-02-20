import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const API_URL = "http://10.0.2.2:8080/api/users";
// const API_URL = "http://localhost:8080/api/users"; // iOS simulator / web

type User = {
  id: number;
  name: string;
  age: number;
};

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((json: User[]) => setUsers(json))
      .catch((e) => setError(e.message ?? "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View>
      <Text>Users from backend:</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {users.map((u) => (
        <View key={u.id}>
          <Text>{u.id}. {u.name}, age {u.age}</Text>
        </View>
      ))}
    </View>
  );
}
