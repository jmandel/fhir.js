subj = require('../src/operation')

Operation = subj.Operation;
Start = subj.Start;
Path = subj.Path;
Method = subj.Method;
Attribute = subj.Attribute;

p = (x)-> console.log(x)
id = (x)-> x
apply = (p,args)-> p.end(id)(args)

describe "Path",->
  it "build path & combine",->

    p0 = Path("BASE")
    p1 = p0.slash(":type")
    p2 = p1.slash(":id")
    p3 = p2.slash("_history")
    p4 = p3.slash((args)-> args.versionId)

    expect(apply(Start.and(p0), {}).url).toEqual("BASE")
    expect(apply(Start.and(p1), {type: 'Patient'}).url).toEqual("BASE/Patient")
    expect(apply(Start.and(p2), {type: 'Patient',id: 5}).url).toEqual("BASE/Patient/5")
    expect(apply(Start.and(p3), {type: 'Patient',id: 5}).url).toEqual("BASE/Patient/5/_history")
    expect(apply(Start.and(p4), {type: 'Patient',id: 5, versionId: 6}).url).toEqual("BASE/Patient/5/_history/6")

describe "Operation",->
  it "build path & combine",->

    path = Path("BASE").slash(":type").slash(":id")

    GET = Operation().and((x)=>x).and((x)=>x).and(Method("GET"))
    op = GET.and(path)
    console.log "test",  apply(op, {type: 'Patient',id: 5})

    res = apply(op, {type: 'Patient',id: 5})
    expect(res.method).toEqual("GET")
    expect(res.url).toEqual("BASE/Patient/5")

    POST = Start.and(Method("POST"))
    jsonify = Attribute('data',(args)-> JSON.stringify(args.resource))
    typePath = Path("BASE").slash(":type")
    xhr = (args)->
      opts = args
      opts.send = true
      return opts

    create = POST.and(typePath).and(jsonify).and(xhr)
    res = apply(create, {type: 'Patient',resource: {name: "Ivan"}})
    expect(res.method).toEqual("POST")
    expect(res.url).toEqual("BASE/Patient")
    expect(res.send).toEqual(true)
    expect(res.data).toEqual('{"name":"Ivan"}')
