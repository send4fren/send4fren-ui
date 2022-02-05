import React from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";
import sizeMe from "react-sizeme";
import Confetti from "react-confetti";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  width: "100%",
  height: "100vh"
};

export const CastConfetti = sizeMe({
  monitorHeight: true,
  monitorWidth: true
})(
  class Example extends React.PureComponent {
    state = {
      animationDone: true
    };

    static propTypes = {
      size: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
      })
    };

    componentDidMount() {
      setTimeout(() => {
        this.toggleConfetti();
      }, 3000);
    }

    toggleConfetti = () => {
      this.setState({ animationDone: !this.state.animationDone });
    };

    render() {
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
        >
            {this.state.animationDone ? (
                <Confetti
                gravity={0.4}
                run={this.state.animationDone}
                numberOfPieces={400}
                // {...this.props.size}
                />
            ): (<div/>)}

        </div>
      );
    }
  }
);

// const App = () => (
//   <div >
//     <DimensionedExample />
//     <h2>Start editing to see some magic happen {"\u2728"}</h2>
//   </div>
// );

// render(<App />, document.getElementById("root"));
