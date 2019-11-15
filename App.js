import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_TASK = "background-fetch-restart-test";
let task_registered = false;
let task_last_ran_at = null;

export default class App extends React.Component {
  state = {
    something: false
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Task registered: {task_registered.toString()}</Text>
        <Text>Task last ran at: {task_last_ran_at || "n/a"}</Text>
        <Button
          onPress={() => this.setState({ something: !this.state.something })}
          title="Refresh"
        />
      </View>
    );
  }
}

TaskManager.defineTask(BACKGROUND_TASK, () => {
  try {
    console.log("running background task");
    task_last_ran_at = new Date();
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.log("Error", error);
    return BackgroundFetch.Result.Failed;
  }
});

BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
  minimumInterval: 1 * 60,
  stopOnTerminate: false,
  startOnBoot: true
});

task_registered = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
