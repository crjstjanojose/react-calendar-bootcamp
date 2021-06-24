import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";
import { IUser, signOutEndPoint } from "./backend";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  userDetails: {
    borderBottom: "1px solid rgb(224,224,224)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "8px",
    "& >*": {
      marginBottom: "8px",
    },
  },
});

interface IUserMenu {
  onSignOut: () => void;
  user: IUser;
}

export function UserMenu(props: IUserMenu) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function signOut() {
    signOutEndPoint();
    props.onSignOut();
  }

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.userDetails}>
          <Avatar>
            <Icon>person</Icon>
          </Avatar>
          <div>{props.user.name}</div>
          <small>{props.user.email}</small>
        </div>
        <MenuItem onClick={signOut}>Sair</MenuItem>
      </Menu>
    </div>
  );
}