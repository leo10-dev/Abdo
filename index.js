
const { Client, Intents , MessageEmbed  , MessageActionRow , MessageButton , MessageSelectMenu , TextInputComponent  , Modal , Permissions} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix } = require('./config.json'); 
const db = require('pro.db');
const { formatDistanceToNow } = require('date-fns');
const ms = require('ms');
const moment = require('moment-timezone');




const discordTranscripts = require('discord-html-transcripts');



const channelIds = ['1255391110415515678', '1255391112718323790', '1255391116740792420' , '1255391119361970278' , '1255391120859332649' , '1255391123476844544' , '1255391124961493024' , '1255391126257668207' , '1255391127754903666'];

client.once('ready', () => {
    console.log('Bot is ready.');


    setInterval(() => {
        const now = new Date();
        const currentHour = now.getUTCHours(); 
        const currentMinute = now.getUTCMinutes();

     
        const astOffset = 3;

        
        const currentHourAst = (currentHour + astOffset) % 24;

        
        const openHour = 9; 
        const openMinute = 0;
        const closeHour = 3;
        const closeMinute = 0;

        
        const utcToAst = (hour, minute) => {
            let astHour = (hour + astOffset) % 24;
            let astMinute = minute;

            if (astHour < 0) {
                astHour += 24;
            }

            return { hour: astHour, minute: astMinute };
        };

        
        channelIds.forEach(async channelId => {
            try {
                const channel = await client.channels.fetch(channelId);
                const llll = await client.channels.fetch('1243118161017180212');


                if (!channel) {
                    console.error(`Channel with ID ${channelId} not found.`);
                    return;
                }

            
                const currentAstTime = utcToAst(currentHour, currentMinute);
                const openAstTime = { hour: openHour, minute: openMinute };
                const closeAstTime = { hour: closeHour, minute: closeMinute };

                const isOpenTime =
                    currentAstTime.hour === openAstTime.hour && currentAstTime.minute === openAstTime.minute;
                const isCloseTime =
                    currentAstTime.hour === closeAstTime.hour && currentAstTime.minute === closeAstTime.minute;

                if (isOpenTime) {
            
                    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                        VIEW_CHANNEL: true,
                    });


                    console.log(`Channel ${channel.name} (${channelId}) shown.`);

                    llll.send(`** > - تـم أرجـاع رومـات الـبـيـ$ـع ، الـنـشـر مـفـتـوح .**`)


                } else if (isCloseTime) {
                    
                    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                        VIEW_CHANNEL: false,
                    });
                    console.log(`Channel ${channel.name} (${channelId}) hidden.`);

                    llll.send(`** > - تـم أخـفـاء رومـات الـبـيـ$ـع ، الـنـشـر مـقـفـول .**`)
                }
            } catch (error) {
                console.error(`Error processing channel ${channelId}:`, error);
            }
        });
    }, 60000); 
});



client.on('messageCreate', message => {

    if (message.author.bot) return;

    if (message.content.startsWith(prefix)) {
   
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

     
        if (command === 'ping') {
            message.reply('Pong!');
        }
        
    }
});


client.on('messageCreate', message => {
    if (message.content.startsWith(prefix + 'ticketSetup')) {
        if (message.author.bot) return;

        let ticketSetup = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setThumbnail(message.guild.iconURL())
            .setTitle('> Hollywoos ``S`` Support・ الدعم الفني')
            .setImage('https://media.discordapp.net/attachments/1255860288775917693/1255905752023830609/New_Project_251_A79F1CB.png?ex=667ed4e0&is=667d8360&hm=ebe4db3ca6f2bff75e5d51ee709fd8e629d9dfda2471c6ed76e29efb44d315f2&=&format=webp&quality=lossless&width=1440&height=525')
            .setDescription('> اذا كان لديك إي استفسار , تبي تشتري رتبة / اعلان / منشور مميز الخ.. اختار الدعم الفني \n >  اذا بغيت شي وما لقيته في السيرفر اختر الطلبات الخاصه \n > اذا كان لديك شكوى على أحد من طاقم الادارة اختار  "شكاوي على "طاقم الادارة\n > ملاحظات  \n \n <:> يمنع فتح تكت لسبب لا يخص السيرفر \n <:> يرجى عدم الازعاج بالمنشن او السبام \n <:> يمنع الاستهبال او فتح تكت بدون سبب \n <:> يمنع الخمول في التكت \n **<:> مخالفة أي من القوانين سيعرضك للميوت او التايم **')

      

              
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_button')
                .setLabel('🎫فـتـح تـذكره')
                .setStyle('PRIMARY')
        );


        message.channel.send({ embeds: [ticketSetup] , components: [row] })
            .catch(err => console.error('Error sending embed:', err));
    }
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ticket_button') {
        
        const row1 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('اختر نوع التذكرة')
            .addOptions([
                {
                    label: 'الدعم الفني',
                   
                    value: 'support',
                },
                {
                    label: 'طلب قاضي ',
                
                    value: 'support2',
                },
                {
                    label: 'طلب وسيط ',
                
                    value: 'support3',
                },
                {
                    label: 'طلبات خاصة',
                
                    value: 'support4',
                },
            ]),
        );



        const embed1 = new MessageEmbed()
        .setColor('DARK_BLUE')
        .setTitle('> يُرجى منك اختيار نوع التذكرة حسب المشكلة التي تواجهك')
        .setThumbnail(interaction.guild.iconURL())
       

        interaction.reply({embeds: [embed1] , components : [row1]  , ephemeral : true})




    }
});




function getUserIdFromChannelTopic(topic) {
    if (!topic) return null; 
    const topicParts = topic.split('|'); 
    if (topicParts.length !== 2) return null; 
    return topicParts[1].trim(); // 
}





client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;
    if (interaction.customId === 'select') {
        const selectedValue = interaction.values[0];
        const categoryId = '1243153298136236104';
        const guild = interaction.guild;
        const userId = interaction.user.id;

     

        let channelOptions = {
            type: 'GUILD_TEXT',
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id, 
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: '1243117940581208074', 
                    allow: ['VIEW_CHANNEL'],
                }
            ],
        };

        let channelName, embedMessage, components;

        switch (selectedValue) {
            case 'support':
                channelName = `Support-${interaction.user.displayName}`;
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage('https://media.discordapp.net/attachments/1255860288775917693/1255905752023830609/New_Project_251_A79F1CB.png?ex=667ed4e0&is=667d8360&hm=ebe4db3ca6f2bff75e5d51ee709fd8e629d9dfda2471c6ed76e29efb44d315f2&=&format=webp&quality=lossless&width=1440&height=525')
                    .setDescription(`**اهلا بك في تذكرة الدعم الفني الخاصة بـ سيرفر Hollywood 

                        - من خلال الدعم يمكنك حل جميع مشاكلك التي تواجهك بالسيرفر 
                        
                        - لـ شراء ' رتب - اعلانات - منشورات - رومات خاصة ' :
                         " يمكنك الاختيار من القائمة الموضحة بالاسفل " 
                        
                        - سوف نأتي اليك باقرب وقت ممكن , يرجى منك عدم الازعاج بالمنشن**`);


                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('close_ticket')
                            .setLabel('Delete')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('escalate_ticket')
                            .setLabel('Manage Ticket')
                            .setStyle('SECONDARY')
                    ),
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select2')
                            .setPlaceholder('Select Type Ticket ..')
                            .addOptions([
                                {
                                    label: 'الرتب',
                                    description: 'لـ شراء الرتب العامة او إزالة التحذيرات او نقل الرتب',
                                    value: 'Roles',
                                },
                                {
                                    label: 'المنشورات المميزة',
                                    description: 'لـ شراء منشور مميز',
                                    value: 'posts',
                                },
                                {
                                    label: 'الأعلانات',
                                    description: 'لـ شراء إعلان لي سيرفرك',
                                    value: 'ads',
                                },
                                {
                                    label: 'الرومات الخاصة',
                                    description: 'لـ شراء روم خاص لنشر منتجاتك',
                                    value: 'rooms',
                                },
                            ])
                    )
                ];
                break;

            case 'support2':
                channelName = `قاضي-${interaction.user.displayName}`;
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage('https://media.discordapp.net/attachments/1213228582126747759/1252071745763016734/image_18.png?ex=6676d0ee&is=66757f6e&hm=8a0ad11893fd51e221d27cce52d203ec965ef0dbbaa775890e155cfbb1316612&=&format=webp&quality=lossless')
                    .setDescription(`مرحباً بك، الرجاء الانتظار لحين حضور القاضي وعدم التزامن بالمنشن. الرجاء ملء النموذج التالي:

                     الرجاء الضغط على زر تقديم بلاغ وملء الاستبيان`);

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('close_ticket')
                            .setLabel('Delete')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('escalate_ticket')
                            .setLabel('Manage Ticket')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setCustomId('leomeessi')
                            .setLabel('تقديم بلاغ')
                            .setStyle('SECONDARY')
                    ),
                ];
                break;

            case 'support3':
                channelName = `طلبات-${interaction.user.displayName}`;
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage('https://media.discordapp.net/attachments/1213228582126747759/1252071745763016734/image_18.png?ex=6676d0ee&is=66757f6e&hm=8a0ad11893fd51e221d27cce52d203ec965ef0dbbaa775890e155cfbb1316612&=&format=webp&quality=lossless')
                    .setDescription(`** مرحباً بك , الرجاء إنتظار طاقم الدعم الفني , وعدم الأزعاج بالمنشن **`);

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('close_ticket')
                            .setLabel('Delete')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('escalate_ticket')
                            .setLabel('Manage Ticket')
                            .setStyle('SECONDARY')
                    ),
                ];
                break;

            case 'support4':
                channelName = `شكوى-${interaction.user.displayName}`;
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage('https://media.discordapp.net/attachments/1213228582126747759/1252071745763016734/image_18.png?ex=6676d0ee&is=66757f6e&hm=8a0ad11893fd51e221d27cce52d203ec965ef0dbbaa775890e155cfbb1316612&=&format=webp&quality=lossless')
                    .setDescription(`مرحباً بك، الرجاء الانتظار لحين حضور القاضي وعدم التزامن بالمنشن. الرجاء ملء النموذج التالي:`);

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('close_ticket')
                            .setLabel('Delete')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('escalate_ticket')
                            .setLabel('Manage Ticket')
                            .setStyle('SECONDARY')
                    ),
                ];
                break;

            default:
                embedMessage = new MessageEmbed()
                .setColor('DARK_BLUE')
                .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
                .setImage('https://media.discordapp.net/attachments/1255860288775917693/1255905752023830609/New_Project_251_A79F1CB.png?ex=667ed4e0&is=667d8360&hm=ebe4db3ca6f2bff75e5d51ee709fd8e629d9dfda2471c6ed76e29efb44d315f2&=&format=webp&quality=lossless&width=1440&height=525')
                .setDescription(`**اهلا بك في تذكرة الدعم الفني الخاصة بـ سيرفر Hollywood 

                    - من خلال الدعم يمكنك حل جميع مشاكلك التي تواجهك بالسيرفر 
                    
                    - لـ شراء ' رتب - اعلانات - منشورات - رومات خاصة ' :
                     " يمكنك الاختيار من القائمة الموضحة بالاسفل " 
                    
                    - سوف نأتي اليك باقرب وقت ممكن , يرجى منك عدم الازعاج بالمنشن**`);

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('close_ticket')
                            .setLabel('Delete')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('claim_ticket')
                            .setLabel('Claim')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('escalate_ticket')
                            .setLabel('Manage Ticket')
                            .setStyle('SECONDARY')
                    ),
                ];
        }

        await interaction.reply({ content: '**جاري إنشاء تذكرة جديدة ...**', ephemeral: true });

        guild.channels.create(channelName, {
            type: 'GUILD_TEXT',
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: "1243117940581208074", 
                    allow: ['VIEW_CHANNEL'],
                }
            ],
        })
        .then(channel => {
            interaction.editReply({ content: `**تم إنشاء تذكرة جديدة ${channel}**`, ephemeral: true });
            if (components && embedMessage) {
                channel.send({ content: `${interaction.user} || <@&1243117940581208074>`, embeds: [embedMessage], components: components })
                    .catch(error => {
                        console.error('Error sending message with components:', error);
                    });
            } else {
                channel.send({ content: `${interaction.user} || <@&1243117940581208074>` }) 
                    .catch(error => {
                        console.error('Error sending message without components:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error creating channel:', error);
            interaction.editReply('حدث خطأ أثناء إنشاء القناة.');
        });
    }
});



client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'close_ticket') {
   
        const confirmationMessage = await interaction.channel.send({
            content: `> ${interaction.user} هل انت متأكد من إغلاق التذكرة `,
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('confirm_close')
                        .setLabel('إغلاق التذكرة')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('cancel_close')
                        .setLabel('إلغاء')
                        .setStyle('SECONDARY')
                )
            ]
        });

        const filter = i => i.customId === 'confirm_close' || i.customId === 'cancel_close';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirm_close') {
                const channelToDelete = i.channel;

                await i.reply('**جاري حذف التذكرة...**');

                const attachment = await discordTranscripts.createTranscript(channelToDelete);
                const transcriptChannel = i.guild.channels.cache.get('1245440307169071115');
                transcriptChannel.send({ content: `**Transcript for ticket deleted by ${i.user.username} ** :`, files: [attachment] });

                channelToDelete.delete()
                    .then(() => {
                        console.log(`Ticket channel ${channelToDelete.name} deleted.`);
                    })
                    .catch(error => {
                        console.error('Error deleting channel:', error);
                        i.reply('حدث خطأ أثناء حذف التذكرة.');
                    });
            } else if (i.customId === 'cancel_close') {
                await i.update({ content: 'تم إلغاء إغلاق التذكرة.', components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                confirmationMessage.edit({ content: 'انتهى الوقت، لم يتم تأكيد إغلاق التذكرة.', components: [] });
            }
        });
      
    } 
});













client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;
    if(interaction.customId === 'claim_ticket') {




        const userId = interaction.user.id;
        const user = interaction.guild.members.cache.get(userId); 
         const requiredRole = '1243117940581208074'
        
         if (!user.roles.cache.has(requiredRole)) {
            await interaction.reply({ content: 'هنهزر يسطا ؟؟', ephemeral: true });
            return;
        }
        let userPoints = db.get(`points_${userId}`) || 0;
        userPoints++;
        db.set(`points_${userId}`, userPoints);

        const embed = new MessageEmbed()
        .setDescription(`**تم استلام تذكرة ${interaction.channel} من قبل الاداري ${interaction.user}**`)
                .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
        .setColor('DARK_BLUE')
 

        await interaction.reply({embeds : [embed]});



    }


})











client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select2') {
        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {
            case 'Roles':
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setDescription('**:emoji_112: يُرجى منك تحديد نوع الرتب المراد شرائها**');

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('Roles')
                            .setLabel('الرتب ')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('delete')
                            .setLabel('إزالة التحذيرات')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('transfRole')
                            .setLabel('نقل الرتب')
                            .setStyle('SECONDARY')
                    )
                ];

                await interaction.reply({ embeds: [embedMessage], components });
                break;


                case 'posts':  

                embedMessage = new MessageEmbed()
                .setColor('DARK_BLUE')
                .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`Mention Here | منشن هير
                    50k Credits :probot:
                    
                    Mention Everyone | منشن ايفريون
                    100k Credits :probot:
                    
                    ملاحظات :
                    
                    ممنوع بيع كردت او طلب كردت
                    ممنوع بيع او طلب عملة حقيقه مثل دولار مقابل كردت او العكس
                    ممنوع طلب او بيع رصيد ( فودافون كاش , اسيا , سوا , الخ  )
                    ممنوع طلب او بيع اي شي +18
                    ممنوع بيع طريقة تكون موجودة على اليوتيوب
                    ممنوع طلب او بيع طرق كردت/نيترو  بجميع اشكالها
                    ممنوع طلب اعضاء او بارتنر
                    ممنوع طلب او بيع فيزات
                    لا يمكنك تعديل المنشور بعد اتمام النشر
                    
                    التحويل لـ @ggj. فقط.`);

                    
                components = [


                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select3')
                            .setPlaceholder('Select Type Ticket ..')
                            .addOptions([
                                {
                                    label: 'منشن هير',
                                    value: 'here',
                                },
                                {
                                    label: 'منشن ايفري ون',
                                    value: 'every',
                                },
                                
                            ])
                    )
        
                    

                ]
              await  interaction.reply({embeds : [embedMessage] , components })
              break;

                case 'ads' :

              embedMessage = new MessageEmbed()
              .setColor('DARK_BLUE')
              .setAuthor(interaction.guild.name, interaction.guild.iconURL())
              .setThumbnail(interaction.guild.iconURL())
              .setDescription('السلام عليكم ورحمة الله ، أسعار الأعلانات كألاتي :\n\nNormal Ads :emoji_439:\n\nMention Here | منشن للأونلاين 💰\nFor : 800k Credits.\n\nMention Everyone  | منشن للجميع 💰\nFor : 1.6m Credits\n\nMention Everyone + Giveways | منشن للجميع + هدية 🌠\nFor : 2.5m\n\nMention Here + Giveways | منشن للأونلاين + هدية 🌠\nFor : 2m\n\nSpical Ads :emoji_439:\n\nMention Everyone + First room for 3d + Giveways | منشن للجميع + اول روم بالسيرفر لمدة ثلاث ايام + هدية :1004369114502008882:\nFor : 4m\n\nMention Everyone + First room for 7d + Giveways | منشن للجميع + اول روم بالسيرفر لمدة اسبوع + هدية :1004369114502008882:\nFor : 7m\n\nومتوفر اعلانات لمسابقات رياكشنات مثل مسابقة صور وغيرها .\n\nالتحويل لـ @ggj. . فقط.')
              components = [


                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('select4')
                        .setPlaceholder('Select Type Ticket ..')
                        .addOptions([
                            {
                                label: 'Mention Here',
                                value: 'MentionHere',
                            },
                            {
                                label: 'Mention Everyone',
                                value: 'MentionEveryone',
                            },
                            {
                                label: 'Mention Everyone + Giveways',
                                value: 'MentionEveryoneGiveways',
                            },
                            {
                                label: 'Mention Here + Giveways',
                                value: 'MentionHereGiveways',
                            },
                            {
                                label: 'Mention Everyone + First room for 3d + Giveways',
                                value: 'MMM1',
                            },
                            {
                                label: 'Mention Everyone + First room for 7d + Giveways',
                                value: 'MMM2',
                            }

                            
                        ])



                )


                
    
                

          ]
              await  interaction.reply({embeds : [embedMessage] , components })
              
              break;



            case 'rooms'  :

            embedMessage = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setAuthor(interaction.guild.name, interaction.guild.iconURL())
            .setThumbnail(interaction.guild.iconURL())
            .setDescription('سعر الرومات الخاصة كالأت :\n\n@unknown-role : منشن هير = 100000\n\nروم خاص بك لمدة اسبوع.\nنشر صور.\nأسم روم بأختيارك\nنشر كل ساعتين\n\nملاحظة : سعر تجديد الروم ( 50k ).')


components = [
    new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId(`buy`)
            .setLabel('شراء الروم')
            .setStyle('SECONDARY')
    )
];
await  interaction.reply({embeds : [embedMessage] , components })

                
        }
    }
});






















    
async function post(interaction, roleName,  rolePrice , channelId) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const idprobot = '929625111311564800';
    const idbank = '816515143118356500 ';
    const tax = Math.floor(rolePrice * (20 / 19) + 1);


    embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`عملية شراء منشور ${roleName} || 👑`)
        .setDescription(`قم بالتحويل ل <@${idbank}>\n#credit ${idbank} ${tax}`)
        .setColor('DARK_BLUE');

    components = [
        new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId(`copy:${roleName}:${rolePrice}`)
                .setLabel('نسخ التحويل ')
                .setStyle('SECONDARY')
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    const filter = (response) => {
        console.log(`Received message: ${response.content}`);
        return response.content.includes(`:moneybag: | ${interaction.user.username}, has transferred \`$${rolePrice}\` to <@!${idbank}>`) && response.author.id === idprobot;
    };
    
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
    });

    collector.on("collect", async (response) => {
        embedMessage.setDescription(`
            عملية شراء منشور 🜲 || ${roleName} :
            > - يمكنك نشر المنشور الان 🜲 || ${roleName} : بسعر ${rolePrice} بنجاح
          
        `);


        let components = [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('modal1')
                    .setLabel('نشر المنشور ')
                    .setStyle('SECONDARY')
            )
        ];
        await interaction.editReply({ embeds: [embedMessage], components });
        
        collector.stop();
    });

    collector.on("end", async (collected) => {
        if (collected.size === 0) {
            embedMessage.setDescription(`لقد انتهى الوقت، لا تقم بالتحويل  ${interaction.user}`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
        }
    });


    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'modal1') {

            const modal1 = new Modal()
			.setCustomId('a2')
			.setTitle('انشر منشورك');
	
		
		const here1 = new TextInputComponent()
			.setCustomId('here1')
			.setLabel("قم بكتابة المنشور")
	
			.setStyle('PARAGRAPH');
		
		
		const secondActionRow = new MessageActionRow().addComponents(here1);

		modal.addComponents(secondActionRow);
		
		await interaction.showModal(modal1);
        }

    })


    client.on('interactionCreate', async interaction => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'a2') {


            const here = interaction.fields.getTextInputValue('here1');

        const channel = await client.channels.fetch(channelId);

          
            embedMessage.setDescription(` تم نشر المنشور بنجاح في ${channel} `)
              await interaction.update({ embeds: [embedMessage], components: [] });  
	    
        channel.send({content : `@${roleName} ${here}`})

        }
    });


}

async function pos(interaction, roleName, rolePrice, categoryId) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const idprobot = '929625111311564800';
    const idbank = '816515143118356500 ';
    const tax = Math.floor(rolePrice * (20 / 19) + 1);

    // Check if user already has a room
    const userChannels = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT' && channel.permissionOverwrites.has(userId));
    if (userChannels.size > 0) {
        await interaction.reply({ content: 'لديك بالفعل روم خاص. لا يمكنك شراء روم إضافي.', ephemeral: true });
        return;
    }

    // Limit total number of rooms
    const totalRooms = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT' && channel.parentId === categoryId).size;
    if (totalRooms >= 15) {
        await interaction.reply({ content: 'تم الوصول إلى الحد الأقصى لعدد الغرف. لا يمكن إنشاء مزيد من الغرف حاليًا.', ephemeral: true });
        return;
    }

    const embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`عملية شراء رتبة ${roleName} || 👑`)
        .setDescription(`قم بالتحويل ل <@${idbank}>\n#credit ${idbank} ${tax}`)
        .setColor('DARK_BLUE');

    const components = [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`copy:${roleName}:${rolePrice}`)
                .setLabel('نسخ التحويل ')
                .setStyle('SECONDARY')
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    const filter = (response) => {
        console.log(`Received message: ${response.content}`);
        return response.content.includes(`:moneybag: | ${interaction.user.username}, has transferred \`$${rolePrice}\` to <@!${idbank}>`) && response.author.id === idprobot;
    };
    
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
    });

    collector.on("collect", async (response) => {
        embedMessage.setDescription(`
            عملية شراء روم خاص 🜲 || ${roleName} :
          > تم تسليمك الروم 🜲 || ${roleName} : بسعر ${rolePrice} بنجاح
           

                  ** اضغط على الزر في الاسفل لنشر روم وتسميته**


        `);

        let components = [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('modal2')
                    .setLabel('نشر المنشور ')
                    .setStyle('SECONDARY')
            )
        ];
        await interaction.editReply({ embeds: [embedMessage], components });

        collector.stop();
    });

    collector.on("end", async (collected) => {
        if (collected.size === 0) {
            embedMessage.setDescription(`لقد انتهى الوقت، لا تقم بالتحويل  ${interaction.user}`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
        }
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'modal2') {
            const modal2 = new Modal()
                .setCustomId('a1')
                .setTitle('انشر منشورك');

            const here2 = new TextInputComponent()
                .setCustomId('here2')
                .setLabel("قم بكتابة المنشور")
                .setStyle('PARAGRAPH');

            const secondActionRow = new MessageActionRow().addComponents(here2);

            modal2.addComponents(secondActionRow);

            await interaction.showModal(modal2);
        }
    });

    client.on('interactionCreate', async interaction => {
        if (interaction.isModalSubmit() && interaction.customId === 'a1') {
            const here = interaction.fields.getTextInputValue('here2');
            const creationDate = new Date();
            const deletionDate = new Date(creationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            try {
                const categoryChannel = await client.channels.fetch(categoryId);
                if (!categoryChannel || categoryChannel.type !== 'GUILD_CATEGORY') {
                    throw new Error('Category not found or not a category channel');
                }

                const newChannel = await interaction.guild.channels.create(interaction.user.displayName, {
                    type: 'GUILD_TEXT',
                    parent: categoryId,
                    topic: 'This channel will be deleted in one week',
                    reason: 'User created a new channel via modal',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                            deny: [Permissions.FLAGS.SEND_MESSAGES],
                        },
                        {
                            id: userId,
                            allow: [Permissions.FLAGS.SEND_MESSAGES],
                        },
                    ],
                });

                const embed = new MessageEmbed()
                    .setTitle('روم خاص جديد')
                    .setDescription(`**مالك الروم:** <@${interaction.user.id}>\n**تاريخ إنشاء الروم:** <t:${Math.floor(creationDate / 1000)}:R>\n**تاريخ إنتهاء الروم:** <t:${Math.floor(deletionDate / 1000)}:R>`)
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL());

                const renameButton = new MessageButton()
                    .setCustomId('rename_channel')
                    .setLabel('Rename Channel')
                    .setStyle('SECONDARY');

                const buttonRow = new MessageActionRow().addComponents(renameButton);

                await newChannel.send({ content: `نشر شي مخالف لقوانين البيع وعليه تحذير = تحذير | عليه سحب = حذف الروم
تحذيرين = حذف الروم `, embeds: [embed], components: [buttonRow] });

                await interaction.reply({ content: `تم نشر المنشور بنجاح في ${newChannel}`, ephemeral: true });

                setTimeout(async () => {
                    await newChannel.delete();
                }, 7 * 24 * 60 * 60 * 1000);

            } catch (error) {
                console.error('Error creating or sending message to the new channel:', error);
                await interaction.reply({ content: 'حدث خطأ أثناء محاولة إنشاء ونشر المنشور في القناة الجديدة. يرجى المحاولة مرة أخرى.', ephemeral: true });
            }
        }
    });

    client.on('interactionCreate', async interaction => {
        if (interaction.isButton() && interaction.customId === 'rename_channel') {
            const channel = interaction.channel;

            if (channel.permissionsFor(interaction.user).has(Permissions.FLAGS.MANAGE_CHANNELS) || channel.permissionsFor(interaction.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
                const modal = new Modal()
                    .setCustomId('renameChannelModal')
                    .setTitle('Rename Channel');

                const newNameInput = new TextInputComponent()
                    .setCustomId('newChannelName')
                    .setLabel('New Channel Name')
                    .setStyle('SHORT');

                const actionRow = new MessageActionRow().addComponents(newNameInput);

                modal.addComponents(actionRow);

                await interaction.showModal(modal);
            } else {
                await interaction.reply({ content: 'ليس لديك صلاحية لتغير اسم هذا الروم الخاص', ephemeral: true });
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === 'renameChannelModal') {
            const newChannelName = interaction.fields.getTextInputValue('newChannelName');
            const channel = interaction.channel;

            if (channel.permissionsFor(interaction.user).has(Permissions.FLAGS.MANAGE_CHANNELS) || channel.permissionsFor(interaction.user).has(Permissions.FLAGS.SEND_MESSAGES)) {
                await channel.setName(newChannelName);
                await interaction.reply({ content: `تم تغير اسم الروم الجديد الي : ${newChannelName}`, ephemeral: true });
            } else {
                await interaction.reply({ content: 'ليس لديك صلاحية لتغير اسم هذا الروم الخاص', ephemeral: true });
            }
        }

    });

}


async function ads(interaction, roleName, rolePrice, categoryId, deleteTime) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const idprobot = '929625111311564800';
    const idbank = '816515143118356500';
    const tax = Math.floor(rolePrice * (20 / 19) + 1);

    if (deleteTime < 1) deleteTime = 300; 

    let embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`عملية شراء إعلان ${roleName} || 👑`)
        .setDescription(`قم بالتحويل ل <@${idbank}>\n#credit ${idbank} ${tax}`)
        .setColor('DARK_BLUE');

    let components = [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`copy:${roleName}:${rolePrice}`)
                .setLabel('نسخ التحويل ')
                .setStyle('SECONDARY')
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    const filter = (response) => {
        console.log(`Received message: ${response.content}`);
        return response.content.includes(`:moneybag: | ${interaction.user.username}, has transferred \`$${rolePrice}\` to <@!${idbank}>`) && response.author.id === idprobot;
    };
    
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
    });

    collector.on("collect", async (response) => {
        embedMessage.setDescription(`**⏬ اضغط على الزر الذي في الاسفل لي نشر إعلانك **`);


        let components = [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('modal3')
                    .setLabel('نشر المنشور ')
                    .setStyle('SECONDARY')
            )
        ];
        await interaction.editReply({ embeds: [embedMessage], components });

        collector.stop();
    });

    collector.on("end", async (collected) => {
        if (collected.size === 0) {
            embedMessage.setDescription(`لقد انتهى الوقت، لا تقم بالتحويل ${interaction.user}`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
        }
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'modal3') {
            const modal3 = new Modal()
                .setCustomId('a13')
                .setTitle('انشر منشورك');

            const roomname = new TextInputComponent()
                .setCustomId('roomname')
                .setLabel("اسم الروم")
                .setStyle('SHORT');

            const here2 = new TextInputComponent()
                .setCustomId('here3')
                .setLabel("قم بكتابة المنشور")
                .setStyle('PARAGRAPH');

            const firstActionRow = new MessageActionRow().addComponents(roomname);
            const secondActionRow = new MessageActionRow().addComponents(here2);

            modal3.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal3);
        }
    });

    client.on('interactionCreate', async interaction => {
        if (interaction.isModalSubmit() && interaction.customId === 'a13') {
            const here = interaction.fields.getTextInputValue('here3');
            const roomname = interaction.fields.getTextInputValue('roomname');

            try {
                const newChannel = await interaction.guild.channels.create(roomname, {
                    type: 'GUILD_TEXT',
                    position: 0, // Position at the top of the channel list
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                            deny: [Permissions.FLAGS.SEND_MESSAGES],
                        },
                        {
                            id: userId,
                            allow: [Permissions.FLAGS.SEND_MESSAGES],
                        },
                    ],
                });

                await newChannel.send({ content: `@everyone ${here}` });

                await interaction.reply({ content: `تم نشر المنشور بنجاح في ${newChannel}`, ephemeral: true });

                setTimeout(async () => {
                    await newChannel.delete();
                }, deleteTime * 1000);

            } catch (error) {
                console.error('Error creating or sending message to the new channel:', error);
                await interaction.reply({ content: 'حدث خطأ أثناء محاولة إنشاء ونشر المنشور في القناة الجديدة. يرجى المحاولة مرة أخرى.', ephemeral: true });
            }
        }
    });
}















// الرومات الخاصة
client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'buy') {

        await pos(interaction, 'here', 100000,'1243118094499708975');


    }
})




// المنشورات المميرزة
client.on('interactionCreate', async interaction => {

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select3') {

        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {
            case 'here':

            post(interaction , 'here' , 75000 , '1245124920355197013')

            break;

            case 'every' :

            post(interaction , 'everyone' , 150000 , '1245124920355197013')



        }

        
    }

})


// الإعلانات
client.on('interactionCreate', async interaction => {

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select4') {

        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {

            case 'MentionHereGiveways' :

            post(interaction , 'here' , 800000 , '1243118143547904061' )

            break ;
            case 'MentionEveryoneGiveways' :

            post(interaction , 'everyone' , 1600000 , '1243118143547904061' )

            break ;
            case 'MentionEveryone' :

            post(interaction , 'everyone' , 2500000  , '1243118143547904061')

            break ;

            case 'MentionHere' :

            post(interaction , 'here' , 2000000 , '1243118143547904061' )

            break ;

            case 'MMM1' :

            ads(interaction , 'everyone' , 4000000 , '1255876596116750407' , 259200 )

            break ;
            case 'MMM2' :

            ads(interaction , 'everyone' , 7000000 , '1255876596116750407' , 604800)

            break;


        }

        
    }

})










client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'transfRole') {
        const userId = interaction.user.id;
        const member = await interaction.guild.members.fetch(userId);

        let roleIds = [
            '1243117961565306970',
            '1243117959069696074',
            '1243117957777985578',
            '1243117960436908092',
            '1254369884629106791',
            '1243117953168445530',
            '1243117952107020368',
            '1243117951008116736',
            '1254804292494430259',
            '1254805928268660817',
            '1254804292494430260', // Corrected to unique key '1254804292494430260'
        ];

        let rolesFound = roleIds.filter(roleId => member.roles.cache.has(roleId));

        console.log(`Roles found: ${rolesFound.join(', ')}`); // Debug output

        if (rolesFound.length > 0) {
            const roleMentions = rolesFound.map(roleId => `<@&${roleId}>`).join(', ');

            let embedMessage = new MessageEmbed()
                .setColor('DARK_BLUE')
                .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`رتب البيع اللي تمتلكها: ${roleMentions}`);

            let components = [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('ttf')
                        .setLabel('نقل')
                        .setStyle('SECONDARY'),
                )
            ];

            await interaction.update({ embeds: [embedMessage], components });
        } else {
            console.log('No roles found for sale.'); // Debug output
            await interaction.reply({ content: 'You do not have any roles for sale.', ephemeral: true });
        }
    }
});









client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ttf') {
        let embedMessage = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setAuthor(interaction.guild.name, interaction.guild.iconURL())
            .setThumbnail(interaction.guild.iconURL())
            .setDescription('**قم بي إرسال ايدي اليوزر الذي تريد التحويل له**');

        await interaction.update({ embeds: [embedMessage], components: [] });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector(filter, { max: 1, time: 60000 });

        collector.on('collect', async message => {
            const targetUserId = message.content.trim();

            const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);
            if (!targetMember) {
                return interaction.reply({ content: 'لم استطع العثور على الحساب يرجى ادخال الحساب بشكل صحيح', ephemeral: true });
            }

            let roleIds = [
                '1254804292494430259',
                '1254805928268660817',
                '1254806199313109003',
                '1243117951008116736',
                '1243117952107020368',
                '1243117953168445530',
                '1243117955810590822',
                '1243117960436908092',
                '1243117957777985578',
                '1243117959069696074',
                '1243117961565306970', // Corrected to unique key '1254804292494430260'
            ];

            let rolesFound = roleIds.filter(roleId => interaction.member.roles.cache.has(roleId));

            try {
                // Transfer roles
                for (let roleId of rolesFound) {
                    await targetMember.roles.add(roleId);
                    await interaction.member.roles.remove(roleId);
                }

                // Confirmation messages
                const roleMentions = rolesFound.map(roleId => `<@&${roleId}>`).join(', ');

                const confirmationEmbed = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`الرتب ${roleMentions}تم نقلها للحساب  <@${targetMember.user.id}>.`);

                await interaction.editReply({ embeds: [confirmationEmbed] });
            } catch (error) {
                console.error('Error transferring roles:', error);
                await interaction.editReply({ content: 'Failed to transfer roles. Please try again later.', ephemeral: true });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'No user ID provided. Interaction cancelled.', ephemeral: true });
            }
        });
    }
});

















const rolePrices = {
    '1249799246475952209':15000,
    '1243117965881376798':25000 ,
    '1243117964144808002': 35000,
};

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'delete') {
        const userId = interaction.user.id;
        const member = await interaction.guild.members.fetch(userId);

        let rolesFound = [];
        let totalPrice = 0;

        for (let roleId in rolePrices) {
            if (member.roles.cache.has(roleId)) {
                rolesFound.push(roleId);
                totalPrice += rolePrices[roleId];
            }
        }

        if (rolesFound.length > 0) {
            await informUser(interaction, rolesFound, totalPrice);
        } else {
            await interaction.reply({ content: 'ليس لديك اي تحذير', ephemeral: true });
        }
    }
});

async function informUser(interaction, rolesFound, totalPrice) {
    const idbank = '816515143118356500 ';
    const idprobot = '929625111311564800';

    const tax = Math.floor(totalPrice * (20 / 19) + 1);

    let embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`انت تمتلك${rolesFound.length} تحذير `)
        .setDescription(`اذا كنت تريد حذف التحذيرات  قم بالضغط على الزر في الاسفل:\n#credit ${idbank} ${tax}`)
        .setColor('DARK_BLUE');

    let components = [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`confirmDelete:${rolesFound.join(',')}:${totalPrice}`)
                .setLabel('Confirm Delete')
                .setStyle('DANGER')
        )
    ];

    await interaction.reply({ embeds: [embedMessage], components });
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith('confirmDelete')) {
        const [, roleIds, totalPrice] = interaction.customId.split(':');
        const userId = interaction.user.id;
        const member = await interaction.guild.members.fetch(userId);
        const idprobot = '929625111311564800';
        const idbank = '816515143118356500 ';
        const tax = Math.floor(totalPrice * (20 / 19) + 1);

        let embedMessage = new MessageEmbed()
            .setThumbnail(interaction.guild.iconURL())
            .setAuthor(interaction.guild.name, interaction.guild.iconURL())
            .setFooter(interaction.guild.name, interaction.guild.iconURL())
            .setTitle(`Remove Warnings || 👑`)
            .setDescription(`الرجاء التحويل الي <@${idbank}>\n#credit ${idbank} ${tax}`)
            .setColor('DARK_BLUE');

        await interaction.update({ embeds: [embedMessage], components: [] });

        const filter = (response) => {
            console.log(`Received message: ${response.content}`);
            return response.content.includes(`:moneybag: | ${interaction.user.username}, has transferred \`$${rolePrice}\` to <@!${idbank}>`) && response.author.id === idprobot;
        };
        
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on("collect", async (response) => {
            embedMessage.setDescription(`تم تأكديد عملية التحويل`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
            for (let roleId of roleIds.split(',')) {
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(roleId);
                }
            }
            collector.stop();
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                embedMessage.setDescription(`لا تقم بالتحويل انتهى الوقت${interaction.user}`);
                await interaction.editReply({ embeds: [embedMessage], components: [] });
            }
        });
    }
});
client.on('interactionCreate', async interaction => {
    
    if (!interaction.isButton()) return;
    if(interaction.customId === 'Roles') {

        const embedMessage = new MessageEmbed()
        .setColor('DARK_BLUE')
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setDescription('**:emoji_112: اختر رتبة من القائمة أدناه:**');

    const components = [
        new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('roleSelect')
                .setPlaceholder('اختر رتبة')
                .addOptions([
                    {
                        label: 'الرتب العامة',
                      
                        value: 'role1',
                    },
                    {
                        label: 'الرتب النادرة',
                        
                        value: 'role3',
                    }
                   
                ])
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    }

})

client.on('interactionCreate', async interaction => {

    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'roleSelect') {

        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {

            case 'role1':
                embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setDescription(`
                        **السلام عليكم ورحمه الله وبركاته ، إسعار رتب البيع كألاتي :
                        
                        Hollywood S = 200k
                        منشن هير.
                        منشن ايفري ون مرة وحدة باليوم.
                        نشر صور.
                        نشر كل ساعة.
                        نشر بـ روم مخصص (Vip-S) .
                        خصم 20% على الاعلانات والرومات الخاصة والخ..
                        
                        Legendary S = 120k
                        منشن هير.
                        نشر صور.
                        نشر كل ساعة.
                        نشر بكل الرومات.
                        خصم 10% على الاعلانات والرومات الخاصة والخ..
                        
                        Special S = 95k
                        منشن هير.
                        نشر صور.
                        نشر كل ساعتين.
                        نشر بكل الرومات.
                        
                        Epic S = 70k
                        منشن هير.
                        نشر صور.
                        نشر كل ساعتين.
                        نشر بكل الرومات ما عدا التصاميم والبرمجيات.
                        
                        Normal S = 50k
                        نشر بكل الرومات ماعدا التصاميم والبرمجيات.
                        بدون منشن هير.
                        نشر صور.
                        نشر كل ساعتين.
                        
                        Developer S = 30k
                        منشن هير.
                        نشر صور.
                        نشر كل ساعتين.
                        نشر بروم برمجيات فقط.
                        
                        Designer S  = 30k
                        منشن هير.
                        نشر صور.
                        نشر كل ساعتين.
                        نشر بروم تصاميم فقط.
                        
                        Temp = 25k
                        نشر بكل الرومات ماعدا التصاميم البرمجيات.
                        نشر صور بروم حسابات فقط.
                        نشر كل 3 ساعات.
                        بدون منشن هير.
                        **`)
                    .setFooter(interaction.guild.name, interaction.guild.iconURL())

                     components = [
                        new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId('roleSelect')
                                .setPlaceholder('اختر رتبة')
                                .addOptions([
                                    {
                                        label: 'Hollywood S',
                                      
                                        value: 'Hollywood',
                                    },
                                    {
                                        label: 'Legendary S',
                                        
                                        value: 'Legendary ',
                                    },
                                    {
                                        label: 'Special S',
                                        
                                        value: 'Special',
                                    },
                                    {
                                        label: 'Epic S',
                                        
                                        value: 'Epic',
                                    },
                                    {
                                        
                                        label: ' Normal S',
                                        
                                        value: 'Normal',
                                    },
                                    {
                                        
                                        label: 'Developer S',
                                        
                                        value: 'Developer',
                                    },
                                    {
                                        label: 'Designer S',
                                        
                                        value: 'Designer',
                                    },
                                    {
                                        label: 'Temp S',
                                        
                                        value: 'Temp',
                                    }

                                    
                                ])
                        )
                    ];






                  //  interaction.update({embeds : [embedMessage] , components : [components]})
                    await interaction.update({ embeds: [embedMessage], components });
                    break;
                    

                    case 'role3' : 
                    embedMessage = new MessageEmbed()
                    .setColor('DARK_BLUE')
                    .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                    .setFooter(interaction.guild.name, interaction.guild.iconURL())
                    .setDescription(`**
                        ✦ ›› Vip S
                        300,000
                        النشر بكل الرومات مع امكانيه نشر صور
                        نشر كل ساعه بروم Vip
                        المنشن افري ون مره اليوم بروم
                        منشور مميز هير كل اسبوع مجانا
                        
                        ✦ ›› Dragon S 
                        700,000
                        النشر بكل الرومات مع امكانية نشر صور
                        نشر كل ساعة بروم Vip
                        مسموحلك تمنشن ايفري ون مرتين باليوم بروم Vip
                        منشور مميز هير كل 4 ايام مجانا
                        خصم 30% على الاعلانات " ما عدا اعلانات الي فيها قيف اوايات "
                        
                        ✦ ›› Goat S
                        1.5M
                        النشر بكل الرومات مع امكانية نشر صور
                        نشر كل ساعة بروم Vip
                        مسموحلك منشن ايفري ون كل 4 ساعات بروم Vip
                        منشور مميز كل يومين مجانا
                        خصم 20% على الاعلانات " ما عدا اعلانات الي فيها قيف اوايات "
                        خصم 25% على الرومات الخاصه
                        روم خاصه أسبوع كل شهر
                        **`)

                    components = [
                       new MessageActionRow().addComponents(
                           new MessageSelectMenu()
                               .setCustomId('roleSelect1')
                               .setPlaceholder('اختر رتبة')
                               .addOptions([
                                   {
                                       label: '✦ ›› Dragon S',
                                     
                                       value: 'Dragon',
                                   },
                                   {
                                       label: '✦ ›› Goat S',
                                       
                                       value: 'Goat ',
                                   },
                                   {
                                       label: '✦ ›› Vip S',
                                       
                                       value: 'Vip',
                                   },
                                  

                                   
                               ])
                       )
                   ];

                   await interaction.update({ embeds: [embedMessage], components });



                    







                        





















                    

        }

        

    }

})



client.on('interactionCreate', async interaction => {
    if (interaction.isSelectMenu() && interaction.customId === 'roleSelect1') {
        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {
            case 'Goat':
                await handleRoleSelection(interaction, ' Goat S', '1254804292494430259 ', 15000000);
                break;
            case 'Dragon':
                await handleRoleSelection(interaction, 'Dragon S', '1254805928268660817 ', 700000);
                break;
            case 'Vip':
                await handleRoleSelection(interaction, 'Vip S', '1254804292494430259 ', 300000);
                break;
        



        }
     
    }

   
});


client.on('interactionCreate', async interaction => {
    if (interaction.isSelectMenu() && interaction.customId === 'roleSelect') {
        const selectedValue = interaction.values[0];

        let embedMessage, components;

        switch (selectedValue) {
            case 'Hollywood':
                await handleRoleSelection(interaction, 'Hollywood S', '1243117951008116736', 200000);
                break;
            case 'Legendary':
                await handleRoleSelection(interaction, 'Legendary S', '1243117952107020368', 125000);
                break;
            case 'Special':
                await handleRoleSelection(interaction, 'Special S', '1243117953168445530', 100000);
                break;
            case 'Epic' :    
            await handleRoleSelection(interaction, 'Epic S', '1243117955810590822', 70000);
            break;

            case 'Normal' :    
            await handleRoleSelection(interaction, 'Normal S', '1243117960436908092', 50000);
            break;

            case 'Developer' :    
            await handleRoleSelection(interaction, 'Developer S', '1243117957777985578', 30000);
            break;

            case 'Designer' :    
            await handleRoleSelection(interaction, 'Designer S', '1243117959069696074', 30001);
            break;
            case 'Temp' :    
            await handleRoleSelection(interaction, 'Temp  S', '1243117961565306970', 25000 );
            break;



        }
    }

});

async function handleRoleSelection(interaction, roleName, roleId, rolePrice) {
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    const idprobot = '929625111311564800';
    const idbank = '816515143118356500 ';
    const tax = Math.floor(rolePrice * (20 / 19) + 1);

    if (member.roles.cache.has(roleId)) {
        await interaction.reply({ content: `لديك هذه الرتبة بالفعل`, ephemeral: true });
        return;
    }

    embedMessage = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL())
        .setAuthor(interaction.guild.name, interaction.guild.iconURL())
        .setFooter(interaction.guild.name, interaction.guild.iconURL())
        .setTitle(`عملية شراء رتبة ${roleName} || 👑`)
        .setDescription(`قم بالتحويل ل <@${idbank}>\n \n \`#credit ${idbank} ${tax}\``)
        .setColor('DARK_BLUE');
        

    components = [
        new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId(`copy:${roleName}:${rolePrice}`)
                .setLabel('نسخ التحويل ')
                .setStyle('SECONDARY')
        )
    ];

    await interaction.update({ embeds: [embedMessage], components });

    const filter = (response) => {
        console.log(`Received message: ${response.content}`);
        return response.content.includes(`:moneybag: | ${interaction.user.username}, has transferred \`$${rolePrice}\` to <@!${idbank}>`) && response.author.id === idprobot;
    };
    
    const collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
    });

    collector.on("collect", async (response) => {
        embedMessage.setDescription(`
            عملية شراء رتبة 🜲  ||   ${roleName} :
            :dim: - تم تسليمك رتبة 🜲  ||  ${roleName} : بسعر ${rolePrice} بنجاح
            :Pin: - لاتنسى قراءة <1243118147607728193#> لتجنب سحب رتبتك
       
        `);
        await interaction.editReply({ embeds: [embedMessage], components: [] });
        await member.roles.add(roleId);
        collector.stop();
    });

    collector.on("end", async (collected) => {
        if (collected.size === 0) {
            embedMessage.setDescription(`لقد انتهى الوقت، لا تقم بالتحويل  ${interaction.user}`);
            await interaction.editReply({ embeds: [embedMessage], components: [] });
        }
    });
}















client.on('messageCreate', async message => {
    if (message.author.bot) return; 

    if (message.content.toLowerCase() === '!leaderboard') {
        const leaderboard = getLeaderboard();
        const embed = generateLeaderboardEmbed(leaderboard);
        message.channel.send({ embeds: [embed] });
    }

  
    if (message.content.toLowerCase() === '!points') {
        const userId = message.author.id;
        const userPoints = db.get(`points_${userId}`) || 0;
        message.reply(`You have ${userPoints} points.`);
    }
});


function getLeaderboard() {
    const allUsers = db.all().filter(data => data.ID.startsWith('points_'));
    const sortedUsers = allUsers.sort((a, b) => b.data - a.data); 
    return sortedUsers.slice(0, 10); 
}


function generateLeaderboardEmbed(leaderboard) {
    const embed = new MessageEmbed()
        .setTitle('Leaderboard')
        .setColor('DARK_BLUE');

    leaderboard.forEach((user, index) => {
        const userId = user.ID.split('_')[1]; 
        const userName = client.users.cache.get(userId)?.username || 'Unknown User'; 
        const userPoints = user.data || 0; 
        embed.addField(`${index + 1}. ${userName}`, `Points: ${userPoints}`, true);
    });

    return embed;
}



const warnRoles = {
    1: '1249799246475952209',
    2: '1243117965881376798',
    3: '1243117964144808002'
};



client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return; // Ignore bot messages and non-command messages

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

  
    if (command === 'warn') {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.reply('You do not have permission to use this command.');
        }
        
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply('Please mention a user to warn.');
        }
        
       
        let warns = db.get(`warns_${user.id}`) || 0;
        warns++;

        db.set(`warns_${user.id}`, warns);

   
        if (warns <= 3) {
            const roleIdToAdd = warnRoles[warns];
            const roleIdToRemove = warnRoles[warns - 1]; 

            if (roleIdToAdd) {
                const roleToAdd = message.guild.roles.cache.get(roleIdToAdd);
                if (roleToAdd) {
                    await user.roles.add(roleToAdd);
                    message.channel.send(`User ${user} has been warned (${warns}/3). They now have role ${roleToAdd.name}.`);

                 
                    if (roleIdToRemove) {
                        const roleToRemove = message.guild.roles.cache.get(roleIdToRemove);
                        if (roleToRemove && user.roles.cache.has(roleToRemove.id)) {
                            await user.roles.remove(roleToRemove);
                        }
                    }
                }
            }
        }
    }
});






client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('copy')) {
        const [, roleName, rolePrice] = interaction.customId.split(':');
        const price = parseInt(rolePrice, 10); 
        const tax = Math.floor(price * (20 / 19) + 1);
        await interaction.reply({ content: `**#credit 816515143118356500  ${tax} **`, ephemeral: true });
    }
});






client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('escalate_ticket')) {
        const selectMenu = new MessageSelectMenu()
            .setCustomId('ticket_action')
            .setPlaceholder('Select an action')
            .addOptions([
                {
                    label: 'Add Member',
                    description: 'Add a member to the ticket',
                    value: 'add_member',
                },
                {
                    label: 'Rename Channel',
                    description: 'Rename the ticket channel',
                    value: 'rename_channel',
                },
                {
                    label: 'Delete User from Ticket',
                    description: 'Remove a user from the ticket',
                    value: 'delete_user',
                }
            ]);

        const row = new MessageActionRow().addComponents(selectMenu);

        await interaction.reply({ content: 'Select an action for the ticket:', components: [row], ephemeral: true });
    } else if (interaction.isSelectMenu() && interaction.customId === 'ticket_action') {
        const selectedAction = interaction.values[0];
        let modal;

        switch (selectedAction) {
            case 'add_member':
                modal = new Modal()
                    .setCustomId('add_member_modal')
                    .setTitle('Add Member')
                    .addComponents(
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('member_id')
                                .setLabel("Member ID")
                                .setStyle('SHORT')
                        )
                    );
                break;
            case 'rename_channel':
                modal = new Modal()
                    .setCustomId('rename_channel_modal')
                    .setTitle('Rename Channel')
                    .addComponents(
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('new_channel_name')
                                .setLabel("New Channel Name")
                                .setStyle('SHORT')
                        )
                    );
                break;
            case 'delete_user':
                modal = new Modal()
                    .setCustomId('delete_user_modal')
                    .setTitle('Delete User from Ticket')
                    .addComponents(
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                                .setCustomId('delete_member_id')
                                .setLabel("Member ID")
                                .setStyle('SHORT')
                        )
                    );
                break;
        }

        await interaction.showModal(modal);
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'add_member_modal') {
            const memberId = interaction.fields.getTextInputValue('member_id');
            const channel = interaction.channel;

            try {
                const member = await interaction.guild.members.fetch(memberId);
                await channel.permissionOverwrites.create(member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
                await interaction.reply({ content: `Successfully added ${member.user.tag} to the ticket.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Failed to add the member. Please ensure the ID is correct.', ephemeral: true });
            }
        } else if (interaction.customId === 'rename_channel_modal') {
            const newChannelName = interaction.fields.getTextInputValue('new_channel_name');
            const channel = interaction.channel;

            try {
                await channel.setName(newChannelName);
                await interaction.reply({ content: `Successfully renamed the channel to ${newChannelName}.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Failed to rename the channel. Please try again.', ephemeral: true });
            }
        } else if (interaction.customId === 'delete_user_modal') {
            const memberId = interaction.fields.getTextInputValue('delete_member_id');
            const channel = interaction.channel;

            try {
                const member = await interaction.guild.members.fetch(memberId);
                await channel.permissionOverwrites.delete(member);
                await interaction.reply({ content: `Successfully removed ${member.user.tag} from the ticket.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Failed to remove the member. Please ensure the ID is correct.', ephemeral: true });
            }
        }
    }
});






client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'leomeessi') {
            const modal = new Modal()
                .setCustomId('exampleModal')
                .setTitle('تقديم البلاغ عن نصاب');

            const shortInput1 = new TextInputComponent()
                .setCustomId('shortInput1')
                .setLabel('ايدي النصاب')
                .setStyle('SHORT');

            const shortInput2 = new TextInputComponent()
                .setCustomId('shortInput2')
                .setLabel('ايدي المنصوب')
                .setStyle('SHORT');

            const shortInput3 = new TextInputComponent()
                .setCustomId('shortInput3')
                .setLabel('المبلغ')
                .setStyle('SHORT');

            const shortInput4 = new TextInputComponent()
                .setCustomId('shortInput4')
                .setLabel('السلعة')
                .setStyle('SHORT');

            const paragraphInput = new TextInputComponent()
                .setCustomId('paragraphInput')
                .setLabel('القصة')
                .setStyle('PARAGRAPH');

            const firstActionRow = new MessageActionRow().addComponents(shortInput1);
            const secondActionRow = new MessageActionRow().addComponents(shortInput2);
            const thirdActionRow = new MessageActionRow().addComponents(shortInput3);
            const fourthActionRow = new MessageActionRow().addComponents(shortInput4);
            const fifthActionRow = new MessageActionRow().addComponents(paragraphInput);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'exampleModal') {
            const shortInput1Value = interaction.fields.getTextInputValue('shortInput1');
            const shortInput2Value = interaction.fields.getTextInputValue('shortInput2');
            const shortInput3Value = interaction.fields.getTextInputValue('shortInput3');
            const shortInput4Value = interaction.fields.getTextInputValue('shortInput4');
            const paragraphInputValue = interaction.fields.getTextInputValue('paragraphInput');

            const channel = interaction.channel;
            const embed = new MessageEmbed()
            .setTitle('Modal Submission')
            .addFields(
                { name: 'ايدي النصاب', value: shortInput1Value },
                { name: 'ايدي المنصوب', value: shortInput2Value },
                { name: 'المبلغ', value: shortInput3Value },
                { name: 'السلعة', value: shortInput4Value },
                { name: 'القصة', value: paragraphInputValue }
            )
            .setColor('DARK_BLUE')
                .setAuthor(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
            
  
        await channel.send({ embeds: [embed] });
            

            await interaction.reply({ content: 'Your response has been recorded.', ephemeral: true });
        }
    }
});









//nodejs-events
process.on("unhandledRejection", e => {
    console.log(e)
})
process.on("uncaughtException", e => {
    console.log(e)
})
process.on("uncaughtExceptionMonitor", e => {
    console.log(e)
})





client.login(token);
