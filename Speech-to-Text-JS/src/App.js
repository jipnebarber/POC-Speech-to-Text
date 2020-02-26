"use strict";

import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";

//------------------------SPEECH RECOGNITION-----------------------------

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.continous = true;

recognition.interimResults = true;

recognition.lang = "en-US";

//------------------------COMPONENT-----------------------------

class Speech extends Component {
  constructor() {
    super();

    this.state = {
      listening: false
    };

    this.toggleListen = this.toggleListen.bind(this);

    this.handleListen = this.handleListen.bind(this);
  }

  toggleListen() {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    );
  }

  handleListen() {
    console.log("listening?", this.state.listening);

    if (this.state.listening) {
      recognition.start();

      recognition.onend = () => {
        console.log("...continue listening...");

        recognition.start();
      };
    } else {
      recognition.stop();

      recognition.onend = () => {
        console.log("Stopped listening per click");
      };
    }

    recognition.onstart = () => {
      console.log("Listening!");
    };

    let finalTranscript = "";

    recognition.onresult = event => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }

      document.getElementById("interim").innerHTML = interimTranscript;

      document.getElementById("final").innerHTML = finalTranscript;

      //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(" ");

      const stopCmd = transcriptArr.slice(-3, -1);

      console.log("stopCmd", stopCmd);

      if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
        recognition.stop();

        recognition.onend = () => {
          console.log("Stopped listening per command");

          const finalText = transcriptArr.slice(0, -3).join(" ");

          document.getElementById("final").innerHTML = finalText;
        };
      }
    };

    //-----------------------------------------------------------------------

    recognition.onsoundend = event => {
      setTimeout(function() {
        finalTranscript += "<br/><br/>";

        document.getElementById("final").innerHTML = finalTranscript;
      }, 5000);
    };

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error);
    };
  }

  render() {
    return (
      <div style={container}>
        <Grid container>
          <Grid item xs={12}>
            <AppBar position="static">
              <Toolbar variant="dense">
                <Typography variant="h6" color="inherit">
                  SPEECH TO TEXT
                </Typography>
              </Toolbar>
            </AppBar>

            <Card>
              <CardContent>
                <Paper id="interim" style={interim} />
                <Paper id="final" style={final} />

                <ButtonGroup
                  orientation="vertical"
                  color="primary"
                  aria-label="vertical outlined primary button group"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    id="microphone-btn"
                    onClick={this.toggleListen}
                  >
                    START TRANSCRIPTION
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    id="microphone-btn"
                    onClick={this.toggleListen}
                  >
                    STOP
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default Speech;

//-------------------------CSS------------------------------------

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

const styles = {
  container: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    textAlign: "center"
  },

  interim: {
    color: "gray",

    border: "#ccc 1px solid",

    padding: "1em",

    margin: "1em",

    width: "1250px"
  },

  final: {
    color: "black",

    border: "#ccc 1px solid",

    padding: "1em",

    margin: "1em",

    width: "1250px"
  }
};

const { container, interim, final } = styles;
