import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);
  async function handleLikeRepository(id) {
    try {
      const { data: repository } = await api.post(`/repositories/${id}/like`);
      const updatedRepositories = repositories.map((repo) =>
        repo.id === repository.id ? repository : repo
      );
      setRepositories(updatedRepositories);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchRepositories() {
    try {
      const { data } = await api.get("/repositories");
      setRepositories(data);
    } catch (error) {
      setRepositories([]);
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRepositories();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          renderItem={({ item, index }) => (
            <RenderRepository
              key={index}
              data={item}
              handleLike={handleLikeRepository}
            />
          )}
          keyExtractor={(item) => item.id}
          extraData={handleLikeRepository}
        />
      </SafeAreaView>
    </>
  );
}

function RenderRepository({ data: { id, title, techs, likes }, handleLike }) {
  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{title}</Text>

      <FlatList
        style={styles.techsContainer}
        data={techs}
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.tech}>
            {item}
          </Text>
        )}
        keyExtractor={(item) => item}
      />

      <View style={styles.likesContainer}>
        <Text style={styles.likeText} testID={`repository-likes-${id}`}>
          {likes} {`curtida${likes === 1 ? "" : "s"}`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLike(id)}
        testID={`like-button-${id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
