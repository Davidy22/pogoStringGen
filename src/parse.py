import re
from itertools import count, groupby

from src.recursiveDescent import Parser, a, anyof, maybe, parser, skip, someof

def natural_sort(l):
	convert = lambda text: int(text) if text.isdigit() else text.lower()
	alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', str(key)) ]
	return sorted(l, key = alphanum_key)

def to_list(parse_tree):
	vals = []
	for i in parse_tree.items:
		if type(i) == parser.Node:
			vals.extend(to_list(i))
		else:
			value = i.value
			try:
				vals.append(int(value))
			except:
				try:
					ends = value.split("-")
					temp = []
					for i in range(int(ends[0].strip()), int(ends[1].strip())+1):
						temp.append(i)
					vals.extend(temp)
				except:
					pass
	return vals
			

def parse(string):
	try:
		tokens= (("[:;,]", "or"),("[^:;,&]+", "dex"), ("&", "and"))
		gram = {
			"EXPR": a(
				"VALUE", maybe(someof(skip("or"), "VALUE"))
			)
			,"VALUE": anyof("dex")
			}

		parser = Parser(tokens, gram)
		result = parser.parse("EXPR", string)
		return to_list(result)
	except:
		return None
	

def condense(vals):
	if vals is None:
		return "error"
	vals = [int(val) for val in vals]
	vals = natural_sort(list(set(vals)))
	groups = groupby(vals, key=lambda item, c=count():item-next(c))
	tmp = [list(g) for k, g in groups]
	tmp = [str(x[0]) if len(x) == 1 else "{}-{}".format(x[0],x[-1]) for x in tmp]
	return ",".join(tmp)
	
def process(string):
	tmp = parse(string)
	return condense(tmp)

def combine(stringList):
	temp = []
	for string in stringList:
		temp.extend(parse(string))
	return condense(temp)

def invert(string):
	tmp = parse(string)
	out = []
	for i in range(1,810):
		if not i in tmp:
			out.append(i)
	return condense(out)
