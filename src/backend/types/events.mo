module {
  // Built-in special event types
  public type EventKind = {
    #Marriage;
    #Promotion;
    #NewJob;
    #NewBaby;
    #Birthday;
    #Graduation;
    #Other;
  };

  // A tweet post request
  public type PostRequest = {
    event : EventKind;
    customText : ?Text; // required when event = #Other
  };
};
