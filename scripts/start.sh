while true
do
	node .
	# If node crashes repeatedly we don't want stderr spammed too fast
	sleep 5
done