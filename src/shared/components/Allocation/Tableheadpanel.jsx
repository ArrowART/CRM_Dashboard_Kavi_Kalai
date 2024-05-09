export default function Tableheadpanel(props){
  const {handleDeleteAll,Uploadform,setglobalfilter}=props;
    return(
        <div className="items-center justify-between px-6 py-4 space-y-3 lg:space-y-0 lg:flex">
            <div>
              <h2 className="mx-1 text-xl font-semibold text-gray-800">
                Allocation
              </h2>
            </div>

            <div>
              <div className="inline-flex lg:gap-x-2 gap-x-3">
                <input type="input" placeholder="Search..." className="px-4 py-2 border outline-none rounded-xl w-[200px] md:w-[250px]" onChange={(e)=>setglobalfilter(e.target.value)} />

                <button onClick={Uploadform} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                  <i className="fi fi-rr-file-upload"></i> <span className="hidden md:block">Upload</span>
                </button>
                <button className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-primary hover:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none">
                <i class="fi fi-rr-add"></i> <span className="hidden md:block">Allocate</span>
                </button>
                <button onClick={handleDeleteAll}  className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-lg gap-x-2 hover:bg-red-800">
  <i className="fi fi-rr-trash"></i> Delete All
</button>

              </div>
            </div>
          </div>
    )
}