import GlobleData from "../../../store/GlobleData"
const Register = () => {
    const {role} = GlobleData();
    const handleRegister = async () =>{

    }
  return (
    <>
        <div>
            <div>
                <h1>Register</h1>
                <form action="" onSubmit={handleRegister}>
                    <div>
                        <label htmlFor="">username <span>*</span></label>
                        <input type="text" placeholder='username' required/>
                    </div>
                    <div>
                        <label htmlFor="">email <span>*</span></label>
                        <input type="email" placeholder='email' name="" id="" required />
                    </div>
                    <div>
                        <label htmlFor="">password <span>*</span></label>
                        <input type="password" placeholder='password' required/>
                    </div>
                    <div>
                        <label htmlFor="">Role <span>*</span></label>
                        {
                            role?.map((roleUser) => {
                                <select name="" id="" >
                                    <option value={roleUser.id}>{roleUser.name}</option>
                                </select>
                            } )
                        }
                    </div>

                    <div>
                        <label htmlFor="">status <span>*</span></label>
                        <select name="" id="">
                            <option value={1}>Active</option>
                            <option value={2}>Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default Register