import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import Grow from "@material-ui/core/Grow";
import Draggable from "react-draggable";

const styles = (theme) => ({
  typography: {
    // margin: theme.spacing.unit * 2,
    cursor: "move",
  },
});

const DraggableWrapper = ({ children, ...other }) => {
  return (
    <Draggable handle=".handle">
      {React.cloneElement(children, { ...other })}
    </Draggable>
  );
};

const DraggableGrow = ({ children, ...other }) => {
  return (
    <Grow {...other} timeout={0}>
      <DraggableWrapper>{children}</DraggableWrapper>
    </Grow>
  );
};

class DraggableDialog extends Component<{
  classes: any;
  open: boolean;
}> {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <Popover
          id="simple-popper"
          open={this.props.open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          TransitionComponent={DraggableGrow}
        >
          <div
            className={"handle " + classes.typography}
            style={{
              height: "25px",
              width: "100%",
              backgroundColor: "#6ECB63",
            }}
          />
          <Typography>{this.props.children}</Typography>
        </Popover>
      </div>
    );
  }
}

export default withStyles(styles)(DraggableDialog);
