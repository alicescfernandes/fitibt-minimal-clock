function HelloWorld(props) {
    return (
      <Page>
        <Section
          title={<Text bold align="center">Location settings</Text>}>
        <Text>This will be used to get the weather data</Text>
          <TextInput
            settingsKey="lat"
            label="Latitude"
            title="Latitude"
          />
         <TextInput
            settingsKey="lng"
            label="Longitude"
            title="Longitude"
          />
         
         <TextInput
            settingsKey="key"
            label="Open Weather Map Key"
            title="Open Weather Map Key"
          />
        <Text>Use your own API key to fetch the weather data</Text>

        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(HelloWorld);
  