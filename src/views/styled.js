import styled from "styled-components";


export const PageStyle = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f7f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  line-height: 16px;
`

export const VideoContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.hidden ? "50px" : "100%")};
`

export const Callframe = styled.div`
  width: 100%;
  height: 100%;
`

export const StartContainer = styled.div`
  display: ${(props) => (props.hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: center;
  button {
    background: #1bebb9;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    padding: 6px 18px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
  }
  h4 {
    text-align: center;
  }
  div.url-form {
    display: flex;
    margin: 16px 0;
  }
  input {
    padding: 6px 4px;
    font-size: 12px;
    margin: 0;
    border-radius: 0;
    width: 200px;
    border: 1px solid lightgray;
    outline: none;
  }
  .join-btn {
    margin: 0;
    border-radius: 0;
  }
`
export const LoungeContainer = styled.div`
  width: 100%;
  height: calc(100vh - 52px);
  background-color: #131216;
  color: ghostwhite;
  padding: 0 18px;

  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    grid-auto-rows: max-content;
  }
  .room {
    background-color: #23212d;
    text-align: center;
  }
  .action-btn {
    cursor: pointer;
    font-weight: 500;
  }
  ul {
    text-align: left;
    width: 75%;
    margin: 0 auto;
    strong {
      text-decoration: underline;
    }
    p {
      margin: 0;
    }
  }
`
