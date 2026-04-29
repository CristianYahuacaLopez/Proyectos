/*try{
        const response = await fetch(`http://localhost::5000/api/sqlserver/users/${corrreo}`);
        console.log(response)
    if(!response.ok){
        throw new Error(`Error en la petición: &{response.status}`);
    }
    const user = await response.json();
    console.log(datos);

    }catch(error){
        console.error("Hubo un problema: ", error.message);
    }
*/
const correo = 'cris@telematica.com'
fetch(`http://localhost::5000/api/sqlserver/users/${corrreo}`)
    .then(res=> res.json())
    .then(usuario=>console.log(usuario))
    .catch(err=>console.error(err));