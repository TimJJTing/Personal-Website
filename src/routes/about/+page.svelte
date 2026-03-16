<script>
	let { data } = $props();
	let meta = $derived(data.meta);

	/**
	 * @param {string} dateStr
	 */
	function formatDate(dateStr) {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatDateRange(startTime, endTime) {
		const start = formatDate(startTime);
		const end = endTime ? formatDate(endTime) : 'Present';
		return `${start} - ${end}`;
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatYearRange(startTime, endTime) {
		const startYear = new Date(startTime).getFullYear();
		const endYear = endTime ? new Date(endTime).getFullYear() : undefined;
		if (endYear && endYear !== startYear) {
			return `${startYear} - ${endYear}`;
		}
		return `${startYear}`;
	}

	/**
	 * @template {Record<string, any> & {publish: boolean}} T
	 * @param {T[]} items
	 * @returns {T[]}
	 */
	function published(items) {
		return items.filter((item) => item.publish);
	}
</script>

<main>
	<section>
		<article>
			<h1>{meta.title}</h1>

			{#if meta.summary}
				<h2>Summary</h2>
				<p>{meta.summary}</p>
			{/if}

			{#if meta.experience?.publish && meta.experience.content?.length}
				<h2>Experience</h2>
				{#each published(meta.experience.content) as job}
					<h3>{job.title}</h3>
					<p>
						<strong>{job.company}</strong>
						<em>{formatDateRange(job.startTime, job.endTime)}</em><br />
						{job.location}
					</p>
					{#if job.works?.length}
						<ul>
							{#each job.works as work}
								<li>{work}</li>
							{/each}
						</ul>
					{/if}
				{/each}
			{/if}

			{#if meta.education?.publish && meta.education.content?.length}
				<h2>Education</h2>
				{#each published(meta.education.content) as edu}
					<p>
						<strong>{edu.title}</strong>
						<em>{formatYearRange(edu.startTime, edu.endTime)}</em><br />
						{edu.institute}<br />
						{edu.location}
					</p>
					{#if edu.works?.length}
						<ul>
							{#each edu.works as work}
								<li>{work}</li>
							{/each}
						</ul>
					{/if}
				{/each}
			{/if}

			{#if meta.skills?.publish && meta.skills.content?.length}
				<h2>Skills</h2>
				<ul>
					{#each published(meta.skills.content) as skill}
						<li>
							<strong>{skill.title}:</strong>
							{skill.description || ''}
						</li>
					{/each}
				</ul>
			{/if}

			{#if meta.interests?.publish && meta.interests.content?.length}
				<h2>Interests / Hobbies</h2>
				<ul>
					{#each published(meta.interests.content) as interest}
						<li>{interest.title}</li>
					{/each}
				</ul>
			{/if}

			{#if meta.links?.length}
				<h2>Links</h2>
				<ul>
					{#each meta.links as link}
						<li><a href={link.url}>{link.title}</a></li>
					{/each}
				</ul>
			{/if}
		</article>
	</section>
</main>
