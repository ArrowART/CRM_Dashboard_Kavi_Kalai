const SignIn = (props) => {

    const { handlechange, handlelogin } = props;

    return (
        <section className="relative flex items-center justify-center overflow-hidden h-dvh">
            <div className="absolute top-20 -right-14"> <img src="/images/Rectangle 348.svg" alt="" className="h-[100px]"/></div>
            <div className="absolute -bottom-5 -left-[13%] hidden xl:block">  <img src="/images/Group 37.png" alt="" /></div>
            <div className="max-w-[30rem] w-full px-4 md:px-6  mx-auto">
                <div className="grid grid-cols-1 px-2 mb-10 2xl:mb-0 ">
                    <div className="relative">
                        <div className="relative z-10 p-10 overflow-hidden bg-white border rounded-xl">
                            <div className="mb-10">
                                <h1 className="text-2xl font-semibold text-primary">Sign In</h1>
                            </div>
                            <form className="space-y-5" onSubmit={handlelogin}>
                                <div>
                                    <input type="text" onChange={handlechange} name="UserName" id="UserName " className="w-full px-4 py-3 border outline-none rounded-xl placeholder-slate-500" placeholder="Username" required/>
                                </div>
                                <div>
                                    <input type="password" onChange={handlechange} name="Password" id="Password" className="w-full px-4 py-3 border outline-none rounded-xl placeholder-slate-500" placeholder="Password" required/>
                                </div>
                                <div>
                                    <button type="submit" className="py-3 px-4 border rounded-xl w-full bg-[#F64E4E] text-white">
                                        Sign In
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="absolute top-20 -left-14"> <img src="/images/Rectangle 348.svg" alt="" className="h-[100px]" /></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;