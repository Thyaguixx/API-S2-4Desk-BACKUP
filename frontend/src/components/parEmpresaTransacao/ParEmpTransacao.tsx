import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import limpo from "../images/limpo.png";
import usado from "../images/usado.png";
import { Autocomplete, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Axios from "axios"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



export default function ParEmpTransacao() {
  // const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [selectedButton, setSelectedButton] = React.useState("Transação");
  const [estabelecimentos, setEstabelecimentos] = React.useState<{ EstabelecimentoNomeFantasia: string }[]>([]);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = React.useState("");


  const handleButtonClick = (buttonName: React.SetStateAction<string>) => {
    setSelectedButton(buttonName);
  };

  const [selectedGroup1, setSelectedGroup1] = React.useState("");

  const handleGroup1ButtonClick = (buttonName: React.SetStateAction<string>) => {
    setSelectedGroup1(buttonName);
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: '#136935',
      },
      secondary: {
        main: "#FFFFFF",
      },
    },
  });

  const [count1, setCount1] = React.useState(1);
  const [count2, setCount2] = React.useState(1);

  const listaEstabelecimentos = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/recupera-estabelecimentos");

      if (response.data.Estabelecimentos) {
        setEstabelecimentos(response.data.Estabelecimentos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    listaEstabelecimentos();
  }, []);

  const montaObjEstabelecimento = async (nomeFantasia: any) => {
    const resultado = await Axios.get(`http://localhost:3001/GETEstabelecimentoByNomeFantasia/${nomeFantasia}`)
    if (resultado.data.Estabelecimento) {
      const estabelecimento = resultado.data.Estabelecimento
      sessionStorage.setItem('EstabelecimentoID', estabelecimento.EstabelecimentoID)
      console.log(estabelecimento.EstabelecimentoID)
    }
  }

  const handleEstabelecimentoChange = (event: React.ChangeEvent<{}>, newValue: string | null) => {
    if (newValue) {
      // Verifique se o novo valor está na lista de estabelecimentos
      if (estabelecimentos.some(estabelecimento => estabelecimento.EstabelecimentoNomeFantasia === newValue)) {
        setSelectedEstabelecimento(newValue);
        montaObjEstabelecimento(newValue)
      } else {
        // Lidar com o caso em que o valor não está na lista de estabelecimentos
        console.log("Estabelecimento não encontrado na lista");
      }
    }
  };

  return (

    <ThemeProvider theme={theme}>
      <div style={{
        position: 'fixed',
        top: '44%',
        border: '1px solid #000',
        borderColor: 'grey',
        borderRadius: '10px',
        width: '65%',
        height: '48%',
        zIndex: 0,
        marginLeft: '0%'
      }}>

      </div>


      <div
        style={{
          position: 'fixed',
          top: '46%',
          // width: '100%',
          // zIndex: 1000,
          marginLeft: "2%"
        }}
      >

        {/* TEXTO */}
        <Box sx={{ flexGrow: 1, marginLeft: '0%', marginTop: '0%' }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={10}>
              <List>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <ArrowForwardIcon sx={{
                      color: '#136935'
                    }} />
                  </ListItemIcon>
                  <Typography variant="h5">Transferir Óleo</Typography>
                </ListItem>
              </List>

              {/* SELECIONAR O ESTABELECIMENTO JÁ EXISTENTE*/}
              <Autocomplete 
                disablePortal
                id="combo-box-demo"
                options={estabelecimentos.map(estabelecimento => estabelecimento.EstabelecimentoNomeFantasia)}
                value={selectedEstabelecimento}
                onChange={handleEstabelecimentoChange}
                sx={{ width: 900 }}
                renderInput={(params) => <TextField {...params} label="Empresa que deseja transferir" />}
              />
            </Grid>
{/* DEFINIÇÃO DE LITROS */}
            <Grid item xs={6} md={5}>
              {/* TEXTO */}
              <List
                sx={{
                  marginLeft: '-12%'
                }}
              >
                <ListItem disablePadding>
                  <ListItemText inset primary="Selecione o tipo de óleo e quantidade:" />
                </ListItem>
              </List>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Contêiner para os botões 'usado' e 'limpo' */}
                <div id='containerBotoes' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '45%' }}>
                  {/* BOTÃO ÓLEO LIMPO */}
                  <div
                    style={{
                      marginLeft: '10%',
                      width: '30%'
                    }}>
                    <Button
                      sx={{
                        height: '100px',
                        borderRadius: '20px',
                        backgroundColor: selectedGroup1 === 'limpo' ? '#YourSelectedColor' : 'transparent'
                      }}
                      variant="contained"
                      onClick={() => {
                        handleGroup1ButtonClick("limpo")
                        sessionStorage.setItem('tipoOleo', 'Limpo')
                      }}
                    >
                      <img src={limpo} alt="png" style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }} />
                    </Button>
                    {/* TEXTO */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '70%', marginLeft: '2%', marginTop: '5%' }}>limpo</div>
                    </div>
                  </div>

                  {/* BOTÃO ÓLEO USADO */}
                  <div
                    style={{
                      marginRight: '15%',
                      width: '30%'
                    }}>
                    <Button
                      sx={{
                        height: '100px',
                        borderRadius: '20px',
                        backgroundColor: selectedGroup1 === 'usado' ? '#YourSelectedColor' : 'transparent'
                      }}

                      variant="contained"
                      onClick={() => {
                        handleGroup1ButtonClick("usado")
                        sessionStorage.setItem('tipoOleo', 'Usado')
                      }}
                    >
                      <img src={usado} alt="png" style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%' }} />
                    </Button>
                    {/* TEXTO */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '70%', marginLeft: '2%', marginTop: '5%' }}>usado</div>
                    </div>
                  </div>
                </div>
                <div style={{ border: '1px solid #000', borderColor: 'grey', padding: '1px', borderRadius: '10px', width: '33%', height: '80px', marginLeft: '12%', marginTop: '3%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '6%' }}>
                  {/* BOTÃO - */}
                  <Button id='button1'
                    aria-label="reduce"
                    onClick={() => {
                      setCount1(Math.max(count1 - 1, 0));
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>

                  {/* NÚMERO CONTAGEM */}
                  <Badge color="secondary">
                    <span style={{ fontSize: '24px' }}>{count1}</span>
                  </Badge>

                  {/* BOTÃO + */}
                  <Button id='button2'
                    aria-label="increase"
                    onClick={() => {
                      setCount1(count1 + 1);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </div>

               

                  {/* TEXTO */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '70%', marginLeft: '2%', marginTop: '2%' }}>litros</div>
                  </div>
                </div>
              </div>
            </Grid>
            {/* DEFINIÇÃO DE QUANTIDADE */}
            <Grid item xs={6} md={5}>
              <List
                sx={{
                  marginLeft: '12%'
                }}>
                <ListItem disablePadding>
                  <ListItemText inset primary="Quantidade de greenneats:" />
                </ListItem>
              </List>

              {/* Div 'maisemenos' */}
              <div id='maisemenos' style={{ marginLeft: '35%', border: '1px solid #000', borderColor: 'grey', padding: '1px', borderRadius: '10px', width: '33%', height: '80px', marginTop: '5%' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '7%' }}>
                    

                    {/* NÚMERO CONTAGEM */}
                    <Badge color="secondary">
                      <span style={{ fontSize: '24px' }}>{count1}</span>
                    </Badge>

                    
                  </div>

                {/* TEXTO */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '70%', marginLeft: '2%' }}>greenneats</div>
                </div>
              </div>
            </Grid>

            


            {/* BOTÕES DE BAIXO */}
            <Grid item xs={6} md={10}>
              <ThemeProvider theme={theme}>
                <Box sx={{ width: 'auto', marginTop: '1.5%' }}>
                  <Stack spacing={3} direction="row">

                    {/*BOTÃO CANCELAR*/}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginLeft: '35%'
                      }}>
                      <Button
                        variant={selectedButton === "cancelar" ? "contained" : "outlined"}
                      // onClick={() => handleButtonClick("cancelar")}
                      >
                        cancelar
                      </Button>

                      <Box sx={{ width: '15%' }} />

                      {/*BOTÃO TRANSFERIR*/}
                      <Button
                        variant={selectedButton === "transferir" ? "contained" : "outlined"}
                      // onClick={() => handleButtonClick("transferir")}
                      >
                        transferir
                      </Button>
                    </div>
                  </Stack>
                </Box>
              </ThemeProvider>
            </Grid>

          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
}
