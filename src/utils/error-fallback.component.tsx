import React from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';

type TProps = {error: Error; resetError: () => void};

const ErrorFallbackComponent = (props: TProps) => (
  <SafeAreaView>
    <View>
      <Text>Oops! Unexpected Error!</Text>
      <Text>error: {JSON.stringify(props.error)}</Text>
      <Text>message: {props.error.message}</Text>
      <Button title="Reload App" onPress={props.resetError} />
    </View>
  </SafeAreaView>
);
export default ErrorFallbackComponent;
